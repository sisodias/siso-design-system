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
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIBRARY_ROOT = path.join(ROOT, 'library')
const MANIFEST_PATH = path.join(ROOT, 'library', 'manifest.json')
const RATINGS_DB_PATH = path.join(ROOT, 'ratings.db')
// better-sqlite3 is installed inside viewer/node_modules (not at root)
const VIEWER_NODE_MODULES = path.join(ROOT, 'viewer', 'node_modules')

// ------------------------------------------------------------------------------------------------
// SQLite tag merge — reads component_tags from ratings.db (if table exists)
// SQLite wins on conflict (it is more recent than the registry-item.json snapshot).
// ------------------------------------------------------------------------------------------------

let _sqliteTags = null

function getSqliteTagsForComponent(source, slug) {
  if (_sqliteTags === null) {
    _sqliteTags = new Map()
    try {
      // Use require for synchronous loading (better-sqlite3 is CommonJS)
      const Database = require(path.join(VIEWER_NODE_MODULES, 'better-sqlite3'))
      const db = new Database(RATINGS_DB_PATH)
      const rows = db
        .prepare('SELECT source, slug, tag FROM component_tags')
        .all()
      for (const row of rows) {
        const key = `${row.source}/${row.slug}`
        if (!_sqliteTags.has(key)) _sqliteTags.set(key, new Set())
        _sqliteTags.get(key).add(row.tag)
      }
      db.close()
    } catch {
      // No ratings.db or no component_tags table — no-op
      _sqliteTags = new Map()
    }
  }
  const key = `${source}/${slug}`
  return _sqliteTags.has(key) ? [..._sqliteTags.get(key)] : []
}

// ------------------------------------------------------------------------------------------------
// Merge curation tags: registry-item.json + SQLite (SQLite wins on conflicts)
// Persist merged tags back to registry-item.json if SQLite adds new tags.
// ------------------------------------------------------------------------------------------------

function getAndMergeCurationTags(item, source, slug) {
  const jsonTags = item._provenance?.curationTags ?? []
  const sqliteTags = getSqliteTagsForComponent(source, slug)

  // Merge: all JSON tags + SQLite tags not already in JSON
  const merged = [...new Set([...jsonTags, ...sqliteTags])]

  // If SQLite contributed new tags, update registry-item.json for persistence
  const hasNewSqliteTags = sqliteTags.some(t => !jsonTags.includes(t))
  if (hasNewSqliteTags && merged.length > 0) {
    try {
      if (!item._provenance) item._provenance = {}
      item._provenance.curationTags = merged.sort()
      writeFileSync(
        path.join(LIBRARY_ROOT, source, slug, 'registry-item.json'),
        JSON.stringify(item, null, 2) + '\n',
        'utf-8',
      )
    } catch {
      // Non-fatal — best-effort persistence
    }
  }

  return merged
}

// Known broken package import patterns that cause webpack build failures.
// These packages are referenced in library component source files but are NOT
// installed in the viewer. Marking their components as non-renderable prevents
// the preview-imports map from including them, avoiding webpack compilation errors.
const BROKEN_PACKAGE_PATTERNS = [
  '@base-ui-components/',  // correct name is @base-ui/react
  'dicons',              // not installed
  'react-cn',            // not installed
  'tsparticles',         // not installed; correct: @tsparticles/slim or @tsparticles/react
  'next-themes',         // not installed; correct: next-themes (different package)
  'leaflet',             // not installed; leaflet has CSS loading requirements
  'dotted-map',          // not installed
  'react-countup',       // not installed; correct: react-countup (different package name)
  'md5',                 // not installed; correct: crypto or md5-types
  'date-fns-tz',        // not installed; not in dependencies
  'react-tooltip',       // not installed; correct: react-tooltip (different package)
  '@reach/portal',       // not installed; correct: @reach/portal or @radix-ui/portald'
  'react-phone-number-input', // not installed
  'swapy',              // not installed
  '@motionone/utils',    // not installed; correct: motion (the package)
  '@uiw/color-convert',  // not installed; @uiw/react-color-convert is the package
  '@uiw/react-color-hue', // not installed; @uiw/react-color is the package
  '@uiw/react-color-saturation', // not installed; @uiw/react-color is the package
  'react-syntax-highlighter',     // not installed; shiki is installed instead
  'simplex-noise',               // not installed
  '@uidotdev/usehooks',          // not installed; usehooks-ts is installed instead
  '@splinetool/runtime',        // not installed; @splinetool/react-spline is installed but not the runtime
  '@hookform/resolvers/zod',    // version mismatch: @hookform/resolvers requires zod v4 path ./v4/core which is not exported by the installed zod version
]

// Component slugs whose source files have webpack-parseable TypeScript/JSX errors
// that cause the webpack build to fail. Extend this list when new failures appear.
const SUPPRESSED_COMPONENT_SLUGS = new Set([
  // beratberkayg — TypeScript duplicate/overlapping exports
  'beratberkayg-animated-button',
  'beratberkayg-button-1',
  'beratberkayg-subscription-card',
  'beratberkayg-wallet-card-2',
  // Missing/wrong package name imports
  'designali-in-hero-designali',
  'designali-in-image-zoom',
  'easemize-hero-with-video',
  'hari-button-8',
  'jsaj2024-dynamic-background',
  'karthikmudunuri-testimonal-slider',
  'ln-dev7-follower-counter',
  'lovesickfromthe6ix-interactive-map',
  'lovesickfromthe6ix-vhs-hero-section',
  'mlshv-confetti',
  'muhammad-binsalman-shiny-button-1',
  'muhammad-binsalman-spider-verse-glitch-button',
  'ncdai-wheel-picker',
  'originui-image-crop',
  'osmosupply-parallax-scrolling',
  'preetsuthar17-cursor',
  'reuno-ui-card-carousel',
  'reuno-ui-crypto-dashboard',
  'ringlabs-interactive-animated-arrow-icon',
  'serafimcloud-balloons',
  'shadcnblockscom-logos3',
  'ruixen-ui-case-studies',
  'ruixen-ui-mail-checker-input',
  'ruixen-ui-ruixen-stats',
  'shugar-calendar',
  'shugar-context-card-1',
  'shugar-split-button',
  'theritikk-luma-spin',
  'uilayout.contact-phone-input',
  'uilayout.contact-swapy-draggable-card',
  'uilayout.contact-text-marque',
  'uplusion23-color-picker',
  'vaib215-hero-with-product-mockup',
  'xubohuah-vaporize-animation-text',
  'bankkroll-auth-form-1',
  'serafimcloud-splite',
  'ahmedmayara-one-time-password-sign-in-card',
  'aghasisahakyan1-interactive-3d-robot',
  'aghasisahakyan1-galaxy-interactive-hero-section',
  'aghasisahakyan1-3d-hero-section-boxes',
  // All aghasisahakyan1-* components use @splinetool/runtime which is not installed
  // (transitive dep of @splinetool/react-spline that is missing from node_modules)
  'aghasisahakyan1-ai-input',
  'aghasisahakyan1-ai-input-hero',
  'aghasisahakyan1-aniamted-pricing-cards',
  'aghasisahakyan1-animated-card',
  'aghasisahakyan1-animated-card-1',
  'aghasisahakyan1-animated-characters-login-page',
  'aghasisahakyan1-animated-chart-card',
  'aghasisahakyan1-animated-comman-menu',
  'aghasisahakyan1-animated-list',
  'aghasisahakyan1-animated-profile-card',
  'aghasisahakyan1-animated-search-bar',
  'aghasisahakyan1-anomaly-heatmap',
  'aghasisahakyan1-api-rate-limiting-card',
  'aghasisahakyan1-blog-post-card',
  'aghasisahakyan1-browser-preview',
  'aghasisahakyan1-draw-with-cursor',
  'aghasisahakyan1-dynamic-island',
  'aghasisahakyan1-expandable-card',
  'aghasisahakyan1-flickering-footer',
  'aghasisahakyan1-flipping-card',
  'aghasisahakyan1-hero-section',
  'aghasisahakyan1-hero-section-nexus',
  'aghasisahakyan1-link-preview',
  'aghasisahakyan1-live-feed',
  'aghasisahakyan1-loader',
  'aghasisahakyan1-login-activity',
  'aghasisahakyan1-mini-navbar',
  'aghasisahakyan1-moving-circles-shader',
  'aghasisahakyan1-multimodal-ai-chat-input',
  'aghasisahakyan1-navbar-with-animated-mega-dropdown',
  'aghasisahakyan1-quick-links-card',
  'aghasisahakyan1-rainbow-matrix-shader',
  'aghasisahakyan1-reasoning',
  'aghasisahakyan1-section-with-mockup',
  'aghasisahakyan1-sign-in-flow-1',
  'aghasisahakyan1-speed-lines-shader',
  'aghasisahakyan1-stacked-alerts',
  'aghasisahakyan1-star-button',
  'aghasisahakyan1-statistics-card',
  'aghasisahakyan1-sticky-section-tabs',
  'aghasisahakyan1-swipe-animation',
  'aghasisahakyan1-user-profile-card',
  'aghasisahakyan1-waves-shader',
  // reaviz — TypeScript complex charting deps (all 41 components have transitive type errors)
  'reaviz-advanced-normalized-incident-report',
  'reaviz-area-chart',
  'reaviz-area-chart-1',
  'reaviz-area-chart-2',
  'reaviz-area-chart-medium',
  'reaviz-area-chart-small',
  'reaviz-area-chart-xs',
  'reaviz-areachart-multiseries',
  'reaviz-bar-chart-medium',
  'reaviz-detailed-normalized-incident-report',
  'reaviz-funnel-chart',
  'reaviz-funnel-chart-big',
  'reaviz-funnel-chart-medium',
  'reaviz-heat-map',
  'reaviz-heat-map-middle',
  'reaviz-heat-map-xl',
  'reaviz-hexagon-map',
  'reaviz-horizontal-bar-big',
  'reaviz-horizontal-bar-chart',
  'reaviz-horizontal-bar-medium',
  'reaviz-incident-bar-chart',
  'reaviz-incident-chart',
  'reaviz-incident-report',
  'reaviz-incident-report-1',
  'reaviz-incident-report-large',
  'reaviz-incident-report-middle',
  'reaviz-interpolation-chart',
  'reaviz-interpolation-chart-1',
  'reaviz-interpolation-chart-middle',
  'reaviz-layered-chart-medium',
  'reaviz-layered-chart-xl',
  'reaviz-layered-funnel-chart',
  'reaviz-multi-series-bar',
  'reaviz-multi-series-bar-1',
  'reaviz-multi-series-bar-big',
  'reaviz-stacked-bar',
  'reaviz-stacked-bar-medium',
  'reaviz-stacked-bar-xl',
  'reaviz-stacked-chart',
  'reaviz-stacked-diverging-bar',
  'reaviz-stacked-normalized-incident-chart',
])

function scanSourceFiles(folderPath) {
  const allFiles = []
  let entries = []
  try {
    entries = readdirSync(folderPath)
  } catch {
    return allFiles
  }
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry)
    let stat
    try {
      stat = statSync(fullPath)
    } catch {
      continue
    }
    if (stat.isDirectory()) {
      allFiles.push(...scanSourceFiles(fullPath).map(f => path.join(entry, f)))
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      allFiles.push(entry)
    }
  }
  return allFiles
}

function hasBrokenDeps(folderPath, files) {
  // Scan ALL source files in the folder (not just item.files) to catch missing
  // packages referenced in non-demo files like case-studies.tsx, code-block.tsx, etc.
  const sourceFiles = scanSourceFiles(folderPath)
  const exportSet = new Set()
  for (const fileName of sourceFiles) {
    const filePath = path.join(folderPath, fileName)
    let content
    try {
      content = readFileSync(filePath, 'utf-8')
    } catch {
      continue
    }
    for (const pattern of BROKEN_PACKAGE_PATTERNS) {
      if (content.includes(pattern)) return true
    }
    // Detect duplicate exports (e.g. "export function Book" + "export { Book, Stack }")
    const exportFnMatches = content.matchAll(/\bexport\s+function\s+(\w+)/g)
    for (const m of exportFnMatches) exportSet.add(m[1])
    const reExportMatches = content.matchAll(/\bexport\s+\{\s*([^}]+)\s*\}/g)
    for (const m of reExportMatches) {
      for (const name of m[1].split(',')) {
        const trimmed = name.trim().split(' as ')[0].trim()
        if (trimmed && exportSet.has(trimmed)) return true
        exportSet.add(trimmed)
      }
    }
  }
  return false
}

function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

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

      const folderPath = path.join(sourcePath, slug)

      // Verify at least one demo file actually exists on disk before including.
      // registry-item.json may list demo.tsx but the file might be named differently
      // or missing entirely (stale registry data).
      const folderEntries = readdirSync(folderPath)
      const actualDemoFile = folderEntries.find(f => /^demo\.(tsx?|jsx?)$/.test(f))
      if (!actualDemoFile) continue

      const componentHasBrokenDeps =
        SUPPRESSED_COMPONENT_SLUGS.has(slug) || hasBrokenDeps(folderPath)

      items.push({ source, slug, itemPath, hasBrokenDeps: componentHasBrokenDeps })
    }
  }

  return items
}

function buildFacets(entries, field) {
  const counts = {}
  for (const entry of entries) {
    const value = entry[field]
    if (Array.isArray(value)) {
      for (const v of value) counts[v] = (counts[v] || 0) + 1
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

  let existingGeneratedAt = undefined
  try {
    const existing = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
    existingGeneratedAt = existing.generatedAt
  } catch {}

  const components = registryItems.map(({ source, slug, itemPath, hasBrokenDeps }) => {
    const item = readJSON(itemPath)
    const sourcePath = path.join(LIBRARY_ROOT, source)
    const folderPath = path.join(sourcePath, slug)
    const readmePath = path.join(folderPath, 'README.md')
    const classificationPath = path.join(folderPath, 'classification.json')
    const classification = readJSON(classificationPath)

    const preview = hasBrokenDeps
      ? { ...item.preview, renderable: false }
      : item.preview

    // Merge curation tags: registry-item.json + SQLite (SQLite wins)
    const curationTags = getAndMergeCurationTags(item, source, slug)

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
      preview,
      ...(existsSync(path.join(folderPath, 'preview.png'))
        ? { thumbnail: `/thumbnails/${source}__${slug}.png`, hasThumbnail: true }
        : { thumbnail: null, hasThumbnail: false }),
      importMode: item._provenance?.importMode ?? undefined,
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
      curationTags,
    }
  })

  components.sort((a, b) => `${a.source}/${a.name}`.localeCompare(`${b.source}/${b.name}`))

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
    curationTags: buildFacets(normalizedComponents.filter(c => c.curationTags && c.curationTags.length > 0), 'curationTags'),
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
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for',
  'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'it',
  'its', 'component', 'ui', 'react', 'design', 'layout',
])

function tokenize(text) {
  if (!text) return []
  return text.toLowerCase().split(/\W+/).filter(t => t.length >= 2 && !STOPWORDS.has(t))
}

const manifest = buildManifest()

// ------------------------------------------------------------------------------------------------
// Tokenize aiSummary + useCases per component; compute IDF across corpus
// ------------------------------------------------------------------------------------------------

const docFreq = new Map()
for (const entry of manifest.components) {
  const txt = (entry.aiSummary || '') + ' ' + ((entry.useCases || []).join(' '))
  entry.tokens = [...new Set(tokenize(txt))]
  for (const t of entry.tokens) docFreq.set(t, (docFreq.get(t) || 0) + 1)
}
const N = manifest.components.length
manifest.facets.idf = Object.fromEntries(
  [...docFreq].map(([t, df]) => [t, Math.log(N / df)])
)

// ------------------------------------------------------------------------------------------------
// Write manifest
// ------------------------------------------------------------------------------------------------

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
