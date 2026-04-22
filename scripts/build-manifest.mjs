#!/usr/bin/env node
/**
 * scripts/build-manifest.mjs
 *
 * Scans library/{source}/{slug}/registry-item.json and emits library/manifest.json.
 * Run manually after any library/ change, or via `npm run build:manifest`.
 *
 * Schema version: 1
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIBRARY_ROOT = path.join(ROOT, 'library')
const MANIFEST_PATH = path.join(ROOT, 'library', 'manifest.json')

function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

/**
 * Derive addedAt: prefer _provenance.fetchedAt, else mtime of registry-item.json.
 */
function getAddedAt(itemPath) {
  const item = readJSON(itemPath)
  if (item?._provenance?.fetchedAt) return item._provenance.fetchedAt
  try {
    return statSync(itemPath).mtime.toISOString()
  } catch {
    return undefined
  }
}

/**
 * Recursively find all registry-item.json files under a root.
 * Returns array of { source, slug, itemPath }.
 */
function findRegistryItems(root) {
  const items = []
  let sources = []
  try {
    sources = readdirSync(root)
  } catch {
    return items
  }

  for (const source of sources) {
    const sourcePath = path.join(root, source)
    let slugs = []
    try {
      slugs = readdirSync(sourcePath)
    } catch {
      continue
    }

    for (const slug of slugs) {
      const itemPath = path.join(sourcePath, slug, 'registry-item.json')
      const item = readJSON(itemPath)
      if (!item) continue

      // Include only components that have a demo.tsx in their files list
      const hasDemo = (item.files || []).some(f => /demo\.(tsx?|jsx?)$/.test(f.path))
      if (!hasDemo) continue

      items.push({ source, slug, itemPath })
    }
  }

  return items
}

/**
 * Count occurrences of each distinct value for a given field across entries.
 */
function buildFacets(entries, field) {
  const counts = {}
  for (const entry of entries) {
    const value = entry[field]
    if (Array.isArray(value)) {
      for (const v of value) {
        counts[v] = (counts[v] || 0) + 1
      }
    } else if (value != null) {
      counts[value] = (counts[value] || 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
}

function buildManifest() {
  const registryItems = findRegistryItems(LIBRARY_ROOT)

  // Preserve generatedAt if manifest already exists (idempotent rebuilds)
  let existingGeneratedAt = undefined
  try {
    const existing = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
    existingGeneratedAt = existing.generatedAt
  } catch {}

  const components = registryItems.map(({ source, slug, itemPath }) => {
    const item = readJSON(itemPath)
    const sourcePath = path.join(LIBRARY_ROOT, source)
    const folderPath = path.join(sourcePath, slug)
    const readmePath = path.join(folderPath, 'README.md')

    return {
      source,
      name: slug,
      displayName: item.title || prettifyName(slug),
      description: item.description || '',
      platform: item.platform || 'Mixed',
      tags: item.tags || [],
      files: item.files?.map(f => f.path) || [],
      addedAt: getAddedAt(itemPath),
      relativePath: `library/${source}/${slug}/`,
      folderPath,
      readmePath,
      preview: item.preview,
      // Thumbnail fields: populated by W3; null here
      thumbnail: null,
      hasThumbnail: false,
    }
  })

  // Sort components by source/name
  components.sort((a, b) => `${a.source}/${a.name}`.localeCompare(`${b.source}/${b.name}`))

  const facets = {
    sources: buildFacets(components, 'source'),
    tags: buildFacets(components, 'tags'),
    platforms: buildFacets(components, 'platform'),
  }

  return {
    generatedAt: existingGeneratedAt || new Date().toISOString(),
    schemaVersion: 1,
    total: components.length,
    components,
    facets,
  }
}

function prettifyName(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

// Run
const manifest = buildManifest()

// Verify facet counts sum to total
const sourcesTotal = manifest.facets.sources.reduce((s, f) => s + f.count, 0)
if (sourcesTotal !== manifest.total) {
  console.warn(
    `[build-manifest.mjs] WARNING: facets.sources sum (${sourcesTotal}) !== total (${manifest.total})`
  )
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8')
console.log(
  `[build-manifest.mjs] Done. ${manifest.total} components written to library/manifest.json`
)
console.log(
  `  Sources: ${manifest.facets.sources.map(s => `${s.value}(${s.count})`).join(', ')}`
)
