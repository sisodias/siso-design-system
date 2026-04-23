/**
 * viewer/lib/ratings.ts
 *
 * Thin SQLite wrapper for the gamified rating system.
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
// DB path — repo root, not inside viewer/
// ------------------------------------------------------------------------------------------------

const DB_PATH = path.resolve(process.cwd(), '../ratings.db')

// ------------------------------------------------------------------------------------------------
// Singleton DB connection (one per process)
// ------------------------------------------------------------------------------------------------

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(DB_PATH)

  // WAL mode for safer concurrent access
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  // Create tables
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

  return _db
}

// ------------------------------------------------------------------------------------------------
// Elo math (K=32)
// ------------------------------------------------------------------------------------------------

const ELO_K = 32

function eloExpected(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

function eloUpdate(rating: number, score: number, expected: number): number {
  return Math.round(rating + ELO_K * (score - expected))
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
// Auto-promotion: write to registry-item.json
// ------------------------------------------------------------------------------------------------

function attemptPromotion(source: string, slug: string, elo: number, action?: string): void {
  // Find registry-item.json path
  // Components live at library/{source}/{slug}/registry-item.json relative to repo root
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

    if (elo > 1400 || action === 'love') {
      // Promote to curated
      json._provenance.importMode = 'curated'
      json._provenance.promotedAt = new Date().toISOString()
      json._provenance.promotionReason = action === 'love' ? 'love_swipe' : `elo_${elo}`
    } else if (elo < 1000) {
      // Mark as auto-hidden
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
  const db = getDb()
  ensureComponent(source, slug)
  const row = db.prepare('SELECT elo FROM components WHERE source = ? AND slug = ?').get(source, slug) as { elo: number } | undefined
  return row?.elo ?? 1200
}

export function recordSwipe(source: string, slug: string, action: 'skip' | 'keep' | 'love'): void {
  const db = getDb()
  ensureComponent(source, slug)

  // Record the swipe
  db.prepare('INSERT INTO swipes (source, slug, action) VALUES (?, ?, ?)').run(source, slug, action)

  // For "love" or "keep", bump elo slightly; for "skip", drop slightly
  const current = db.prepare('SELECT elo, votes FROM components WHERE source = ? AND slug = ?').get(source, slug) as { elo: number; votes: number }

  let newElo = current.elo
  if (action === 'love') {
    newElo = Math.round(current.elo + 20)
  } else if (action === 'keep') {
    newElo = Math.round(current.elo + 8)
  } else if (action === 'skip') {
    newElo = Math.round(current.elo - 10)
  }

  db.prepare('UPDATE components SET elo = ?, votes = votes + 1 WHERE source = ? AND slug = ?').run(newElo, source, slug)

  // Auto-promotion check
  attemptPromotion(source, slug, newElo, action)
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

  // Update elos + vote counts
  db.prepare('UPDATE components SET elo = ?, votes = votes + 1 WHERE source = ? AND slug = ?').run(newAElo, a.source, a.slug)
  db.prepare('UPDATE components SET elo = ?, votes = votes + 1 WHERE source = ? AND slug = ?').run(newBElo, b.source, b.slug)

  // Auto-promotion checks
  attemptPromotion(a.source, a.slug, newAElo)
  attemptPromotion(b.source, b.slug, newBElo)

  return { aElo: newAElo, bElo: newBElo }
}

export function getLeaderboard(
  limit = 50,
  source?: string,
  category?: string,
): Array<{ source: string; slug: string; elo: number; votes: number }> {
  const db = getDb()

  let query = 'SELECT source, slug, elo, votes FROM components WHERE votes > 0'
  const params: (string | number)[] = []

  if (source) {
    query += ' AND source = ?'
    params.push(source)
  }

  query += ' ORDER BY elo DESC LIMIT ?'
  params.push(limit)

  return db.prepare(query).all(...params) as Array<{ source: string; slug: string; elo: number; votes: number }>
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

  // Count promotions by checking registry files — approximate by elo > 1400
  const promotedCount = (db.prepare('SELECT COUNT(*) as n FROM components WHERE elo > 1400').get() as { n: number }).n

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
