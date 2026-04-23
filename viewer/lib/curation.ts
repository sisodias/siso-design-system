/**
 * viewer/lib/curation.ts
 *
 * SQLite wrapper for the curation-tags system.
 * DB lives at design-system/ratings.db (repo root, gitignored).
 *
 * Uses better-sqlite3 synchronous API — fine for a local tool.
 * Lazy-loads the DB connection on first call (doesn't open at import time).
 */

import Database from 'better-sqlite3'
import path from 'path'

// ------------------------------------------------------------------------------------------------
// Cloudflare Workers guard
// better-sqlite3 is a native Node.js addon and cannot run on the Workers runtime.
// ------------------------------------------------------------------------------------------------
const IS_CF_WORKERS = process.env.CF_WORKERS === '1'

function cfUnavailable(): never {
  throw new Error('Curation DB unavailable on Cloudflare Workers (native SQLite not supported)')
}

// ------------------------------------------------------------------------------------------------
// DB path — repo root, not inside viewer/
// ------------------------------------------------------------------------------------------------

const DB_PATH = process.env.CF_WORKERS === '1' ? '' : path.resolve(process.cwd(), '../ratings.db')

// ------------------------------------------------------------------------------------------------
// Singleton DB connection (one per process)
// ------------------------------------------------------------------------------------------------

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (IS_CF_WORKERS) cfUnavailable()
  if (_db) return _db
  _db = new Database(DB_PATH)

  // WAL mode for safer concurrent access
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')

  // Create tables
  _db.exec(`
    CREATE TABLE IF NOT EXISTS component_tags (
      source           TEXT NOT NULL,
      slug             TEXT NOT NULL,
      tag              TEXT NOT NULL,
      added_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      source_of_truth  TEXT DEFAULT 'manual',
      PRIMARY KEY (source, slug, tag)
    );

    CREATE INDEX IF NOT EXISTS idx_tags_tag ON component_tags(tag);
  `)

  return _db
}

// ------------------------------------------------------------------------------------------------
// Add a single tag
// ------------------------------------------------------------------------------------------------

export function addTag(
  source: string,
  slug: string,
  tag: string,
  sourceOfTruth: 'manual' | 'auto-elo' | 'auto-love-swipe' = 'manual',
): void {
  const db = getDb()
  db.prepare(`
    INSERT OR IGNORE INTO component_tags (source, slug, tag, source_of_truth)
    VALUES (?, ?, ?, ?)
  `).run(source, slug, tag, sourceOfTruth)
}

// ------------------------------------------------------------------------------------------------
// Remove a single tag
// ------------------------------------------------------------------------------------------------

export function removeTag(source: string, slug: string, tag: string): void {
  const db = getDb()
  db.prepare(`
    DELETE FROM component_tags WHERE source = ? AND slug = ? AND tag = ?
  `).run(source, slug, tag)
}

// ------------------------------------------------------------------------------------------------
// Bulk add/remove tags, returns updated tag set for the component
// ------------------------------------------------------------------------------------------------

export function bulkTags(
  source: string,
  slug: string,
  add?: string[],
  remove?: string[],
): { tags: string[] } {
  const db = getDb()

  if (remove && remove.length > 0) {
    const removeStmt = db.prepare(`
      DELETE FROM component_tags WHERE source = ? AND slug = ? AND tag = ?
    `)
    for (const tag of remove) {
      removeStmt.run(source, slug, tag)
    }
  }

  if (add && add.length > 0) {
    const addStmt = db.prepare(`
      INSERT OR IGNORE INTO component_tags (source, slug, tag, source_of_truth)
      VALUES (?, ?, ?, 'manual')
    `)
    for (const tag of add) {
      addStmt.run(source, slug, tag)
    }
  }

  return { tags: getTagsForComponent(source, slug) }
}

// ------------------------------------------------------------------------------------------------
// Get all tags for a specific component
// ------------------------------------------------------------------------------------------------

export function getTagsForComponent(source: string, slug: string): string[] {
  const db = getDb()
  const rows = db
    .prepare('SELECT tag FROM component_tags WHERE source = ? AND slug = ?')
    .all(source, slug) as { tag: string }[]
  return rows.map(r => r.tag)
}

// ------------------------------------------------------------------------------------------------
// List all tags with their counts, sorted desc by count
// ------------------------------------------------------------------------------------------------

export function listAllTagsWithCounts(): { tag: string; count: number }[] {
  const db = getDb()
  return db
    .prepare('SELECT tag, COUNT(*) as count FROM component_tags GROUP BY tag ORDER BY count DESC')
    .all() as { tag: string; count: number }[]
}

// ------------------------------------------------------------------------------------------------
// List all components that have a given tag
// ------------------------------------------------------------------------------------------------

export function listComponentsByTag(tag: string): { source: string; slug: string }[] {
  const db = getDb()
  return db
    .prepare('SELECT source, slug FROM component_tags WHERE tag = ?')
    .all(tag) as { source: string; slug: string }[]
}
