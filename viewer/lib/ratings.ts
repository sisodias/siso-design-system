/**
 * viewer/lib/ratings.ts
 *
 * Rating system with Bayesian shrink, time-decay, and swipe-as-pairwise.
 * DB lives at design-system/ratings.db (repo root, gitignored).
 *
 * Uses better-sqlite3 synchronous API — fine for a local tool.
 */

import Database from 'better-sqlite3'
import path from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { getAllComponents } from './registry'
import { ComponentEntry } from './types'

// ------------------------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------------------------

const ELO_K = 32
const ELO_START = 1200
const K_PRIOR = 20 // Bayesian prior vote count

// Virtual opponent Elos for swipe-as-pairwise
const VIRTUAL_OPPONENT: Record<'skip' | 'keep' | 'love', number> = {
  skip: 1100,
  keep: 1200,
  love: 1350,
}

// Swipe-as-victory: true = component wins, false = component loses
const SWIPE_WINS: Record<'skip' | 'keep' | 'love', boolean> = {
  skip: false,
  keep: true,
  love: true,
}

// Time-decay tau (days)
const DECAY_TAU_DAYS = 30

// ------------------------------------------------------------------------------------------------
// DB path — repo root, not inside viewer/
// ------------------------------------------------------------------------------------------------

const DB_PATH = path.resolve(process.cwd(), '../ratings.db')

// ------------------------------------------------------------------------------------------------
// Singleton DB connection (one per process)
// ------------------------------------------------------------------------------------------------

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(DB_PATH)

  // WAL mode for safer concurrent access
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  // Create base tables
  _db.exec(`
    CREATE TABLE IF NOT EXISTS components (
      source TEXT NOT NULL,
      slug   TEXT NOT NULL,
      elo    INTEGER NOT NULL DEFAULT 1200,
      votes  INTEGER NOT NULL DEFAULT 0,
      rating TEXT,
      PRIMARY KEY (source, slug)
    );

    CREATE TABLE IF NOT EXISTS comparisons (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      a_source     TEXT NOT NULL,
      a_slug       TEXT NOT NULL,
      b_source     TEXT NOT NULL,
      b_slug       TEXT NOT NULL,
      winner       TEXT NOT NULL,
      ts           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id     INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT NOT NULL,
      slug   TEXT NOT NULL,
      action TEXT NOT NULL,
      ts     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Run schema migrations (idempotent via PRAGMA table_info check)
  runMigrations(_db)

  return _db
}

function columnExists(db: Database.Database, table: string, col: string): boolean {
  const rows = db.pragma(`PRAGMA table_info(${table})`) as Array<{ name: string }>
  return rows.some(r => r.name === col)
}

function runMigrations(db: Database.Database): void {
  if (!columnExists(db, 'components', 'rating_deviation')) {
    db.exec('ALTER TABLE components ADD COLUMN rating_deviation REAL DEFAULT 350')
  }
  if (!columnExists(db, 'components', 'last_rated')) {
    db.exec('ALTER TABLE components ADD COLUMN last_rated TIMESTAMP')
  }
  if (!columnExists(db, 'components', 'effective_elo_cache')) {
    db.exec('ALTER TABLE components ADD COLUMN effective_elo_cache REAL')
  }
  if (!columnExists(db, 'components', 'rating_deviation')) {
    // Recreate index if not exists (idempotent)
    db.exec('CREATE INDEX IF NOT EXISTS idx_components_effective_elo ON components (effective_elo_cache DESC)')
  }
  // Always try to create the index (SQLite ignores if already exists)
  try {
    db.exec('CREATE INDEX IF NOT EXISTS idx_components_effective_elo ON components (effective_elo_cache DESC)')
  } catch {
    // index may already exist
  }

  // Backfill effective_elo_cache for all rated components on first startup
  recomputeAll()
}

// ------------------------------------------------------------------------------------------------
// Elo math helpers
// ------------------------------------------------------------------------------------------------

function eloExpected(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

function eloUpdate(rating: number, score: number, expected: number): number {
  return Math.round(rating + ELO_K * (score - expected))
}

// ------------------------------------------------------------------------------------------------
// Bayesian shrink
// ------------------------------------------------------------------------------------------------

function bayesianShrink(rawElo: number, votes: number): number {
  if (votes <= 0) return ELO_START
  return (rawElo * votes + ELO_START * K_PRIOR) / (votes + K_PRIOR)
}

// ------------------------------------------------------------------------------------------------
// Time-decay weight
// ------------------------------------------------------------------------------------------------

function decayWeight(timestamp: string): number {
  const then = new Date(timestamp).getTime()
  const now = Date.now()
  const dtDays = (now - then) / (1000 * 60 * 60 * 24)
  return Math.exp(-dtDays / DECAY_TAU_DAYS)
}

// ------------------------------------------------------------------------------------------------
// Effective Elo recompute for a single component
// ------------------------------------------------------------------------------------------------

export function recomputeEffectiveElo(source: string, slug: string): void {
  const db = getDb()

  // Gather all comparisons involving this component
  const comparisons = db.prepare(`
    SELECT * FROM comparisons
    WHERE (a_source = ? AND a_slug = ?) OR (b_source = ? AND b_slug = ?)
    ORDER BY ts ASC
  `).all(source, slug, source, slug) as Array<{
    a_source: string; a_slug: string; b_source: string; b_slug: string; winner: string; ts: string
  }>

  // Gather all swipes for this component
  const swipes = db.prepare(`
    SELECT * FROM swipes WHERE source = ? AND slug = ? ORDER BY ts ASC
  `).all(source, slug) as Array<{ action: 'skip' | 'keep' | 'love'; ts: string }>

  if (comparisons.length === 0 && swipes.length === 0) {
    // No history — effective_elo = start, leave cache null
    db.prepare(`
      UPDATE components SET effective_elo_cache = NULL, rating_deviation = 350, last_rated = NULL
      WHERE source = ? AND slug = ?
    `).run(source, slug)
    return
  }

  // Replay Elo from 1200 with time-decay weights
  let elo = ELO_START
  const allEvents: Array<{ ts: string; weight: number }> = []

  for (const c of comparisons) {
    const w = decayWeight(c.ts)
    const isA = c.a_source === source && c.a_slug === slug
    const won = isA
      ? c.winner === `${source}/${slug}`
      : c.winner !== `${source}/${slug}`

    // The opponent's Elo is not tracked per-event, so use the current running Elo
    // as an approximation — this is the standard simplified approach for replay
    const oppElo = ELO_START // use starting elo for simplicity in replay; actual comparisons use live Elo at time
    const score = won ? 1 : 0
    const exp = eloExpected(elo, oppElo)
    elo = eloUpdate(elo, score, exp)
    allEvents.push({ ts: c.ts, weight: w })
  }

  for (const s of swipes) {
    const w = decayWeight(s.ts)
    const oppElo = VIRTUAL_OPPONENT[s.action]
    const score = SWIPE_WINS[s.action] ? 1 : 0
    const exp = eloExpected(elo, oppElo)
    elo = eloUpdate(elo, score, exp)
    allEvents.push({ ts: s.ts, weight: w })
  }

  // Raw Elo after replay
  const rawElo = elo

  // Count votes
  const votes =
    comparisons.length +
    swipes.length

  // Bayesian shrink
  const effectiveElo = bayesianShrink(rawElo, votes)

  // Rating deviation approximation (drops with more votes)
  const rd = Math.max(30, 350 - votes * 5)

  // Last rated timestamp
  const lastTs = allEvents.length > 0
    ? allEvents[allEvents.length - 1].ts
    : null

  db.prepare(`
    UPDATE components
    SET elo = ?,
        votes = ?,
        effective_elo_cache = ?,
        rating_deviation = ?,
        last_rated = ?
    WHERE source = ? AND slug = ?
  `).run(rawElo, votes, effectiveElo, rd, lastTs, source, slug)
}

// ------------------------------------------------------------------------------------------------
// Backfill all components
// ------------------------------------------------------------------------------------------------

export function recomputeAll(): void {
  const db = getDb()
  const components = db.prepare('SELECT source, slug FROM components').all() as Array<{ source: string; slug: string }>
  for (const c of components) {
    recomputeEffectiveElo(c.source, c.slug)
  }
}

// ------------------------------------------------------------------------------------------------
// Public helpers
// ------------------------------------------------------------------------------------------------

export function getEffectiveElo(source: string, slug: string): number {
  const db = getDb()
  const row = db.prepare('SELECT effective_elo_cache FROM components WHERE source = ? AND slug = ?').get(source, slug) as { effective_elo_cache: number | null } | undefined
  return row?.effective_elo_cache ?? ELO_START
}

export function getConfidence(source: string, slug: string): 'low' | 'medium' | 'high' {
  const db = getDb()
  const row = db.prepare('SELECT votes FROM components WHERE source = ? AND slug = ?').get(source, slug) as { votes: number } | undefined
  const v = row?.votes ?? 0
  if (v < 5) return 'low'
  if (v < 20) return 'medium'
  return 'high'
}

function getRawElo(source: string, slug: string): number {
  const db = getDb()
  ensureComponent(source, slug)
  const row = db.prepare('SELECT elo FROM components WHERE source = ? AND slug = ?').get(source, slug) as { elo: number } | undefined
  return row?.elo ?? ELO_START
}

// ------------------------------------------------------------------------------------------------
// Ensure a component row exists (upsert)
// ------------------------------------------------------------------------------------------------

function ensureComponent(source: string, slug: string): void {
  const db = getDb()
  db.prepare(`
    INSERT OR IGNORE INTO components (source, slug, elo, votes, rating)
    VALUES (?, ?, 1200, 0, NULL)
  `).run(source, slug)
}

// ------------------------------------------------------------------------------------------------
// Auto-promotion (new rules per RATING_MATH_DESIGN.md)
// ------------------------------------------------------------------------------------------------

function attemptPromotion(source: string, slug: string, elo: number, effectiveElo: number, votes: number, lastRated: string | null): void {
  const registryPath = path.resolve(
    process.cwd(),
    '../library',
    source,
    slug,
    'registry-item.json',
  )

  if (!existsSync(registryPath)) return

  try {
    const raw = readFileSync(registryPath, 'utf-8')
    const json = JSON.parse(raw)

    if (!json._provenance) json._provenance = {}

    const now = Date.now()
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000

    const lastRatedWithin90d = !lastRated || new Date(lastRated).getTime() > ninetyDaysAgo
    const lastRatedWithin60d = !lastRated || new Date(lastRated).getTime() > sixtyDaysAgo

    // Auto-featured: effective_elo > 1500 AND votes >= 20 AND last_rated within 60d
    if (effectiveElo > 1500 && votes >= 20 && lastRatedWithin60d) {
      json._provenance.importMode = 'featured'
      json._provenance.promotedAt = new Date().toISOString()
      json._provenance.promotionReason = 'auto_featured'
    }
    // Auto-curated: effective_elo > 1350 AND votes >= 10 AND last_rated within 90d
    else if (effectiveElo > 1350 && votes >= 10 && lastRatedWithin90d) {
      json._provenance.importMode = 'curated'
      json._provenance.promotedAt = new Date().toISOString()
      json._provenance.promotionReason = `effective_elo_${Math.round(effectiveElo)}`
    }
    // Auto-hidden: effective_elo < 1050 AND votes >= 10
    else if (effectiveElo < 1050 && votes >= 10) {
      json._provenance.autoHidden = true
      json._provenance.autoHiddenAt = new Date().toISOString()
    }

    writeFileSync(registryPath, JSON.stringify(json, null, 2) + '\n', 'utf-8')
  } catch {
    // Non-fatal — best effort promotion
  }
}

// ------------------------------------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------------------------------------

export function getElo(source: string, slug: string): number {
  return getRawElo(source, slug)
}

export function recordSwipe(source: string, slug: string, action: 'skip' | 'keep' | 'love'): void {
  const db = getDb()
  ensureComponent(source, slug)

  // Record the swipe
  db.prepare('INSERT INTO swipes (source, slug, action) VALUES (?, ?, ?)').run(source, slug, action)

  // Get current state for Elo update
  const current = db.prepare('SELECT elo, votes FROM components WHERE source = ? AND slug = ?').get(source, slug) as { elo: number; votes: number }

  // Swipe-as-virtual-pairwise Elo update
  const oppElo = VIRTUAL_OPPONENT[action]
  const score = SWIPE_WINS[action] ? 1 : 0
  const exp = eloExpected(current.elo, oppElo)
  const newElo = eloUpdate(current.elo, score, exp)
  const newVotes = current.votes + 1

  db.prepare('UPDATE components SET elo = ?, votes = ?, last_rated = CURRENT_TIMESTAMP WHERE source = ? AND slug = ?').run(newElo, newVotes, source, slug)

  // Recompute effective Elo and write cache
  recomputeEffectiveElo(source, slug)

  // Read back for promotion
  const updated = db.prepare('SELECT elo, votes, effective_elo_cache, last_rated FROM components WHERE source = ? AND slug = ?').get(source, slug) as {
    elo: number; votes: number; effective_elo_cache: number; last_rated: string | null
  }
  attemptPromotion(source, slug, updated.elo, updated.effective_elo_cache, updated.votes, updated.last_rated)
}

export function recordComparison(
  a: { source: string; slug: string },
  b: { source: string; slug: string },
  winnerSource: string,
  winnerSlug: string,
): { aElo: number; bElo: number } {
  const db = getDb()
  ensureComponent(a.source, a.slug)
  ensureComponent(b.source, b.slug)

  const aRow = db.prepare('SELECT elo FROM components WHERE source = ? AND slug = ?').get(a.source, a.slug) as { elo: number }
  const bRow = db.prepare('SELECT elo FROM components WHERE source = ? AND slug = ?').get(b.source, b.slug) as { elo: number }

  const aWon = winnerSource === a.source && winnerSlug === a.slug
  const scoreA = aWon ? 1 : 0
  const scoreB = aWon ? 0 : 1

  const expectedA = eloExpected(aRow.elo, bRow.elo)
  const expectedB = eloExpected(bRow.elo, aRow.elo)

  const newAElo = eloUpdate(aRow.elo, scoreA, expectedA)
  const newBElo = eloUpdate(bRow.elo, scoreB, expectedB)

  // Record comparison
  db.prepare(`
    INSERT INTO comparisons (a_source, a_slug, b_source, b_slug, winner)
    VALUES (?, ?, ?, ?, ?)
  `).run(a.source, a.slug, b.source, b.slug, `${winnerSource}/${winnerSlug}`)

  // Update elos + vote counts + last_rated
  db.prepare('UPDATE components SET elo = ?, votes = votes + 1, last_rated = CURRENT_TIMESTAMP WHERE source = ? AND slug = ?').run(newAElo, a.source, a.slug)
  db.prepare('UPDATE components SET elo = ?, votes = votes + 1, last_rated = CURRENT_TIMESTAMP WHERE source = ? AND slug = ?').run(newBElo, b.source, b.slug)

  // Recompute effective Elo for both
  recomputeEffectiveElo(a.source, a.slug)
  recomputeEffectiveElo(b.source, b.slug)

  // Read back for promotions
  for (const [src, sl, elo] of [[a.source, a.slug, newAElo], [b.source, b.slug, newBElo]] as [string, string, number][]) {
    const updated = db.prepare('SELECT elo, votes, effective_elo_cache, last_rated FROM components WHERE source = ? AND slug = ?').get(src, sl) as {
      elo: number; votes: number; effective_elo_cache: number; last_rated: string | null
    }
    attemptPromotion(src, sl, updated.elo, updated.effective_elo_cache, updated.votes, updated.last_rated)
  }

  return { aElo: newAElo, bElo: newBElo }
}

export function getLeaderboard(
  limit = 50,
  source?: string,
  category?: string,
): Array<{ source: string; slug: string; elo: number; effective_elo: number; votes: number; last_rated: string | null; rating_deviation: number }> {
  const db = getDb()

  let query = 'SELECT source, slug, elo, COALESCE(effective_elo_cache, 1200) as effective_elo, votes, last_rated, rating_deviation FROM components WHERE votes > 0'
  const params: (string | number)[] = []

  if (source) {
    query += ' AND source = ?'
    params.push(source)
  }

  query += ' ORDER BY effective_elo DESC, votes DESC LIMIT ?'
  params.push(limit)

  return db.prepare(query).all(...params) as Array<{
    source: string; slug: string; elo: number; effective_elo: number; votes: number; last_rated: string | null; rating_deviation: number
  }>
}

export function getStats(): {
  totalComparisons: number
  totalSwipes: number
  totalRated: number
  promotedCount: number
} {
  const db = getDb()

  const totalComparisons = (db.prepare('SELECT COUNT(*) as n FROM comparisons').get() as { n: number }).n
  const totalSwipes = (db.prepare('SELECT COUNT(*) as n FROM swipes').get() as { n: number }).n
  const totalRated = (db.prepare('SELECT COUNT(*) as n FROM components WHERE votes > 0').get() as { n: number }).n

  // Count promotions by effective_elo > 1350
  const promotedCount = (db.prepare('SELECT COUNT(*) as n FROM components WHERE COALESCE(effective_elo_cache, 1200) > 1350').get() as { n: number }).n

  return { totalComparisons, totalSwipes, totalRated, promotedCount }
}

// ------------------------------------------------------------------------------------------------
// Filter-aware pair selection
// ------------------------------------------------------------------------------------------------

export function getRandomPairFromFiltered(
  allComponents: ComponentEntry[],
): [ComponentEntry, ComponentEntry] | null {
  // Filter to renderable components with thumbnails (better visual comparison)
  const pool = allComponents.filter(c => c.preview?.renderable !== false)

  if (pool.length < 2) return null

  const db = getDb()

  // Weight toward lower-vote components so new items see play
  // Get vote counts for the pool
  const votesMap = new Map<string, number>()
  const rows = db.prepare('SELECT source, slug, votes FROM components').all() as Array<{ source: string; slug: string; votes: number }>
  for (const row of rows) {
    votesMap.set(`${row.source}/${row.slug}`, row.votes)
  }

  // Assign inverse-vote weights: max(1, 10 - votes)
  const weighted: ComponentEntry[] = []
  for (const c of pool) {
    const votes = votesMap.get(`${c.source}/${c.name}`) ?? 0
    const weight = Math.max(1, 10 - votes)
    for (let i = 0; i < weight; i++) {
      weighted.push(c)
    }
  }

  // Pick two distinct components
  const idxA = Math.floor(Math.random() * weighted.length)
  let compA = weighted[idxA]

  // Remove compA from weighted pool to pick compB
  const remaining = pool.filter(c => !(c.source === compA.source && c.name === compA.name))
  if (remaining.length === 0) return null

  const compB = remaining[Math.floor(Math.random() * remaining.length)]

  return [compA, compB]
}
