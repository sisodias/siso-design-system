#!/usr/bin/env node
/**
 * scripts/migrate-curation-tags.mjs
 *
 * One-shot migration: converts the old binary _provenance.importMode
 * to the new _provenance.curationTags[] array.
 *
 * - importMode === "curated"  → curationTags = ["keeper"]
 * - otherwise                  → curationTags = []
 *
 * Idempotent: skips components that already have curationTags set.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIBRARY_ROOT = path.join(ROOT, 'library')

function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

let scanned = 0
let migratedToKeeper = 0
let migratedToEmpty = 0
let alreadyHadTags = 0

function migrateRegistryItem(itemPath) {
  const item = readJSON(itemPath)
  if (!item) return

  scanned++

  // Already migrated — skip
  if (Array.isArray(item._provenance?.curationTags)) {
    alreadyHadTags++
    return
  }

  const wasCurated = item._provenance?.importMode === 'curated'

  if (!item._provenance) item._provenance = {}

  if (wasCurated) {
    item._provenance.curationTags = ['keeper']
    migratedToKeeper++
  } else {
    item._provenance.curationTags = []
    migratedToEmpty++
  }

  writeFileSync(itemPath, JSON.stringify(item, null, 2) + '\n', 'utf-8')
}

function walkLibrary() {
  let sources = []
  try {
    sources = readdirSync(LIBRARY_ROOT)
  } catch {
    console.error('[migrate-curation-tags] Cannot read library root')
    process.exit(1)
  }

  for (const source of sources) {
    const sourcePath = path.join(LIBRARY_ROOT, source)
    let slugs = []
    try {
      slugs = readdirSync(sourcePath)
    } catch {
      continue
    }

    for (const slug of slugs) {
      const itemPath = path.join(sourcePath, slug, 'registry-item.json')
      if (existsSync(itemPath)) {
        migrateRegistryItem(itemPath)
      }
    }
  }
}

walkLibrary()

console.log('[migrate-curation-tags] Done.')
console.log(`  scanned: ${scanned}`)
console.log(`  migrated-to-keeper: ${migratedToKeeper}`)
console.log(`  migrated-to-empty: ${migratedToEmpty}`)
console.log(`  already-had-tags: ${alreadyHadTags}`)
