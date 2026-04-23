#!/usr/bin/env node
/**
 * scripts/build-manifest.mjs
 *
 * Scans library/{source}/{slug}/registry-item.json and emits library/manifest.json.
 * Run manually after any library/ change, or via `npm run build:manifest`.
 *
 * Schema version: 1
 */

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'fs'
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
function normalizeToArray(val) {
  if (Array.isArray(val)) return val
  if (val != null) return [val]
  return undefined
}

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
    const classificationPath = path.join(folderPath, 'classification.json')
    const classification = readJSON(classificationPath)

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
      // Thumbnail fields: detect preview.png presence (populated by generate-thumbnails.mjs)
      ...(existsSync(path.join(folderPath, 'preview.png'))
        ? { thumbnail: `/thumbnails/${source}__${slug}.png`, hasThumbnail: true }
        : { thumbnail: null, hasThumbnail: false }),
      // importMode: 'bulk' if set by scraper; undefined = curated (conservative default)
      importMode: item._provenance?.importMode ?? undefined,
      // AI classification fields (populated by classify-components.mjs)
      // Normalize category and complexity to always be arrays
      ...(classification
        ? {
            category: normalizeToArray(classification.category),
            visualStyle: classification.visual_style ?? undefined,
            complexity: normalizeToArray(classification.complexity),
            aiSummary: classification.ai_summary ?? undefined,
            bestForIndustries: classification.best_for_industries ?? undefined,
            useCases: classification.use_cases ?? undefined,
            hasClassification: true,
          }
        : { hasClassification: false }),
    }
  })

  // Sort components by source/name
  components.sort((a, b) => `${a.source}/${a.name}`.localeCompare(`${b.source}/${b.name}`))

  // Normalize complexity (may be a string or array in source data)
  const normalizedComponents = components.map(c => ({
    ...c,
    complexity: Array.isArray(c.complexity) ? c.complexity : (c.complexity ? [c.complexity] : []),
  }))

  const facets = {
    sources: buildFacets(normalizedComponents, 'source'),
    tags: buildFacets(normalizedComponents, 'tags'),
    platforms: buildFacets(normalizedComponents, 'platform'),
    categories: buildFacets(normalizedComponents.filter(c => c.category), 'category'),
    visualStyles: buildFacets(normalizedComponents.filter(c => c.visualStyle), 'visualStyle'),
    industries: buildFacets(normalizedComponents.filter(c => c.bestForIndustries), 'bestForIndustries'),
    complexity: buildFacets(normalizedComponents.filter(c => c.complexity && c.complexity.length > 0), 'complexity'),
  }

  return {
    generatedAt: existingGeneratedAt || new Date().toISOString(),
    schemaVersion: 1,
    total: normalizedComponents.length,
    components: normalizedComponents,
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
console.log(
  `  Categories: ${manifest.facets.categories.slice(0, 5).map(s => `${s.value}(${s.count})`).join(', ')}...`
)
console.log(
  `  VisualStyles: ${manifest.facets.visualStyles.slice(0, 5).map(s => `${s.value}(${s.count})`).join(', ')}...`
)
console.log(
  `  Industries: ${manifest.facets.industries.slice(0, 5).map(s => `${s.value}(${s.count})`).join(', ')}...`
)
console.log(
  `  Complexity: ${manifest.facets.complexity.map(s => `${s.value}(${s.count})`).join(', ')}`
)
