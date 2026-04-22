#!/usr/bin/env node
/**
 * scripts/bulk-import.mjs
 *
 * Generic multi-registry scraper for shadcn-compatible /r/{slug}.json registries.
 * Works with any source that exposes:
 *   - A list endpoint (sitemap or registry.json) yielding {user, slug} pairs or slugs
 *   - Individual item URLs at https://{domain}/r/{...}/{slug}.json
 *
 * Policies:
 *   - Concurrency 8 default (safe floor; Agent A confirmed zero rate limits at 16)
 *   - 2 retries on 5xx transient; permanent skip on 404
 *   - Skip "200 OK + empty JSON body" (found on serafimcloud/ai-chat-input)
 *   - Global registryDependencies dedupe — shadcn/button fetched ONCE regardless of refcount
 *   - Idempotent — skips folders already listed in manifest
 *   - Provenance tags (Phase 6) on every component written
 *   - Regenerates library/manifest.json at end of run
 *
 * CLI:
 *   node scripts/bulk-import.mjs --source=<name> [--limit=N] [--concurrency=8] [--dry-run] [--force]
 *
 * Sources:
 *   21st-dev   — sitemap + /r/{user}/{slug}.json
 *   magicui    — /r/registry.json + /r/{slug}.json
 *   hextaui    — /r/registry.json + /r/{slug}.json
 *   cult-ui    — /r/registry.json + /r/{slug}.json
 *   originui   — TODO: domain redirected to coss.com/ui (different schema); left in config for future work
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIB_ROOT = path.join(ROOT, 'library')
const MANIFEST_PATH = path.join(ROOT, 'library', 'manifest.json')

// ---------------------------------------------------------------------------
// REGISTRIES config
// ---------------------------------------------------------------------------

/**
 * URL verification (2026-04-22):
 *   originui.com  — HTTP 301 → https://coss.com/ui (completely different schema; @coss/ prefix).
 *                   Individual /r/{slug}.json endpoints are dead. LEFT AS TODO.
 *   magicui.design — HTTP 200 on both /r/registry.json and /r/{slug}.json ✅
 *   hextaui.com   — HTTP 307 → www.hextaui.com; both endpoints return valid shadcn JSON ✅
 *   cult-ui.com   — HTTP 200 on both /r/registry.json and /r/{slug}.json ✅
 */
const REGISTRIES = {
  '21st-dev': {
    // List: parse sitemap for /community/components/{user}/{slug} — keep only 2-segment slugs
    sitemapUrl: 'https://21st.dev/sitemap.xml',
    extractFromSitemap: (xml) => {
      const matches = [...xml.matchAll(/https:\/\/21st\.dev\/community\/components\/([^\/<]+)\/([^\/<]+)/g)]
      return matches
        .map(m => ({ user: m[1], slug: m[2] }))
        .filter(({ slug }) => !['popular', 'newest', 'featured', 'week', 'trending'].includes(slug))
    },
    itemUrlFn: ({ user, slug }) => `https://21st.dev/r/${user}/${slug}`,
    folderNameFn: ({ user, slug }) => `${user}-${slug}`.toLowerCase(),
    listSource: '21st-dev-sitemap',
  },

  'originui': {
    // TODO: originui.com redirects to coss.com/ui which has a completely different registry
    // format (uses @coss/* prefixed packages). Not shadcn-compatible. Leaving config here
    // as a reminder if coss.com ever publishes a shadcn-compatible endpoint.
    listUrl: 'https://originui.com/r/registry.json', // DEAD — redirects to coss.com/ui
    itemUrlFn: ({ slug }) => `https://originui.com/r/${slug}.json`, // DEAD
    folderNameFn: ({ slug }) => slug,
    listSource: 'originui-registry-json', // label only; source doesn't work
    DISABLED: true,
  },

  'magicui': {
    listUrl: 'https://magicui.design/r/registry.json',
    itemUrlFn: ({ slug }) => `https://magicui.design/r/${slug}.json`,
    folderNameFn: ({ slug }) => slug,
    listSource: 'magicui-registry-json',
  },

  'hextaui': {
    // Note: hextaui.com returns 307 redirect to www.hextaui.com; both serve valid shadcn JSON
    listUrl: 'https://hextaui.com/r/registry.json',
    itemUrlFn: ({ slug }) => `https://www.hextaui.com/r/${slug}.json`,
    folderNameFn: ({ slug }) => slug,
    listSource: 'hextaui-registry-json',
  },

  'cult-ui': {
    listUrl: 'https://www.cult-ui.com/r/registry.json',
    itemUrlFn: ({ slug }) => `https://www.cult-ui.com/r/${slug}.json`,
    folderNameFn: ({ slug }) => slug,
    listSource: 'cult-ui-registry-json',
  },
}

// ---------------------------------------------------------------------------
// Manifest helpers (shared with build-manifest.mjs contract)
// ---------------------------------------------------------------------------

async function readJSON(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf-8'))
  } catch {
    return null
  }
}

async function readExistingManifest() {
  try {
    return JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'))
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Import rewrite logic (preserved from add-21st.mjs)
// ---------------------------------------------------------------------------

function shortNameFromPath(p) {
  return path.basename(p).replace(/\.(tsx?|jsx?|css|scss|mdx?)$/, '')
}

/**
 * Detect unresolvable imports in a .tsx/.ts file.
 * Returns { hasUnresolvable, reason }.
 * Detects:
 *   - @/demos/* (21st.dev internal demo harness paths)
 *   - other @/ imports beyond the two rewriteImports() handles
 *   - any non-relative import we can't statically resolve is left to npm (no check here)
 *
 * NOTE: missing relative-sibling files (./avatar when ./avatar.tsx doesn't exist
 * in the folder) are caught by a second pass after all files are written — see
 * `hasMissingSiblings()` below.
 */
function detectUnresolvableImports(content) {
  const demosMatch = content.match(/from\s+["']@\/demos\/([^"']+)["']/)
  if (demosMatch) {
    return {
      hasUnresolvable: true,
      reason: `imports 21st.dev internal demo harness (@/demos/${demosMatch[1]})`,
    }
  }
  const lines = content.split('\n')
  for (const line of lines) {
    const m = line.match(/from\s+["']@\/([^"']+)["']/)
    if (m) {
      const p = m[1]
      if (!p.startsWith('components/ui/') && p !== 'lib/utils') {
        return {
          hasUnresolvable: true,
          reason: `imports unresolvable path (@/${p})`,
        }
      }
    }
    // CSS side-effect imports reaching outside the folder (e.g. ../../index.css)
    const cssMatch = line.match(/import\s+["'](\.\.\/\.\.\/[^"']+\.css)["']/)
    if (cssMatch) {
      return {
        hasUnresolvable: true,
        reason: `imports parent CSS (${cssMatch[1]})`,
      }
    }
  }
  return { hasUnresolvable: false, reason: null }
}

/**
 * After all files land in the component folder, scan each .tsx/.ts file for
 * relative imports (./X, ../X) and verify the target exists on disk.
 * Returns { missing: [path1, ...] } — empty array means all resolved.
 */
async function findMissingSiblings(folderPath) {
  const missing = new Set()
  const entries = await fs.readdir(folderPath)
  const files = entries.filter(f => /\.(tsx?|jsx?)$/.test(f))
  const existingBases = new Set(
    entries.map(e => e.replace(/\.(tsx?|jsx?|css|scss|json)$/, ''))
  )
  for (const f of files) {
    const content = await fs.readFile(path.join(folderPath, f), 'utf-8')
    const lines = content.split('\n')
    for (const line of lines) {
      const m = line.match(/from\s+["'](\.\/[^"']+)["']/)
      if (!m) continue
      const importPath = m[1] // e.g. "./avatar"
      const base = importPath.replace(/^\.\//, '').split('/')[0]
      if (!existingBases.has(base)) {
        missing.add(importPath)
      }
    }
  }
  return { missing: [...missing] }
}

function rewriteImports(content) {
  return content
    .replace(/from\s+["']@\/components\/ui\/([a-z0-9-]+)["']/g, 'from "./$1"')
    .replace(/from\s+["']@\/lib\/utils["']/g, 'from "../_utils/cn"')
    // framer-motion v12: motion(Component) → motion.create(Component)
    .replace(/=\s*motion\(/g, '= motion.create(')
}

function allDependencies(items) {
  const deps = new Set()
  for (const item of items) {
    for (const d of item.dependencies || []) deps.add(d)
  }
  return [...deps].sort()
}

// ---------------------------------------------------------------------------
// Core fetch with retry
// ---------------------------------------------------------------------------

async function fetchWithRetry(url, retries = 2) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (res.status === 404) {
        return { status: 404, body: null }
      }
      if (res.status >= 500) {
        lastError = new Error(`HTTP ${res.status} after ${attempt} retries`)
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
        continue
      }
      if (!res.ok) {
        return { status: res.status, body: null }
      }
      const text = await res.text()
      if (!text.trim()) {
        return { status: 200, body: null } // "200 OK + empty body" — skip
      }
      try {
        return { status: 200, body: JSON.parse(text) }
      } catch {
        return { status: 200, body: null }
      }
    } catch (e) {
      lastError = e
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
    }
  }
  return { status: 0, body: null, error: lastError }
}

// ---------------------------------------------------------------------------
// Registry list fetchers
// ---------------------------------------------------------------------------

async function fetch21stDevList(sitemapUrl) {
  const res = await fetch(sitemapUrl)
  if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status}`)
  const xml = await res.text()
  return REGISTRIES['21st-dev'].extractFromSitemap(xml)
}

async function fetchRegistryList(listUrl) {
  const { status, body } = await fetchWithRetry(listUrl)
  if (status !== 200 || !body) throw new Error(`Registry list fetch failed: status=${status}`)
  // Support both { items: [...] } and raw [...] array formats
  const items = Array.isArray(body) ? body : (body.items || [])
  return items.map(item => ({ slug: item.name, data: item }))
}

// ---------------------------------------------------------------------------
// Item resolver — handles shadcn/ dependency shim + global dedupe
// ---------------------------------------------------------------------------

async function resolveRegistryItem(url, visited, items) {
  if (visited.has(url)) return
  visited.add(url)
  const { status, body, error } = await fetchWithRetry(url)
  if (status === 404) return
  if (status !== 200 || !body) {
    throw error || new Error(`Failed to fetch ${url}: status=${status}`)
  }
  items.push({ url, item: body })
  for (const dep of body.registryDependencies || []) {
    if (typeof dep !== 'string') continue
    if (dep.startsWith('http')) {
      // 21st.dev intra-registry dependency
      const m = dep.match(/21st\.dev\/r\/([^/]+)\/([^/?#]+)/)
      if (m) {
        await resolveRegistryItem(`https://21st.dev/r/${m[1]}/${m[2]}`, visited, items)
      }
    } else {
      // shadcn core dependency — fetch once globally
      const shadcnUrl = `https://21st.dev/r/shadcn/${dep}`
      await resolveRegistryItem(shadcnUrl, visited, items)
    }
  }
}

// ---------------------------------------------------------------------------
// File writer — writes component files with import rewrites
// ---------------------------------------------------------------------------

async function writeComponentFiles(folderPath, items) {
  await fs.mkdir(folderPath, { recursive: true })
  for (const { item } of items) {
    for (const f of item.files || []) {
      const base = shortNameFromPath(f.path)
      const ext = path.extname(f.path) || '.tsx'
      const outName = `${base}${ext}`
      const outPath = path.join(folderPath, outName)
      const content = rewriteImports(f.content ?? '')
      await fs.writeFile(outPath, content)
    }
  }
}

// ---------------------------------------------------------------------------
// Demo file generator
// ---------------------------------------------------------------------------

async function ensureDemo(folderPath, items) {
  const hasDemo = items.some(i => i.item.files?.some(f => /demo/i.test(f.path)))
  if (hasDemo) return
  const main = items[0].item
  const mainFile = main.files[0]
  const mainBase = shortNameFromPath(mainFile.path)
  const exportMatch = (mainFile.content ?? '').match(/export\s+(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/)
  const exportName = exportMatch ? exportMatch[1] : 'Component'
  const demoContent = `"use client"\nimport { ${exportName} } from "./${mainBase}"\n\nexport default function DemoOne() {\n  return (\n    <div className="flex h-full w-full items-center justify-center p-6">\n      <${exportName} />\n    </div>\n  )\n}\n`
  await fs.writeFile(path.join(folderPath, 'demo.tsx'), demoContent)
}

// ---------------------------------------------------------------------------
// registry-item.json builder (Phase 6 provenance)
// ---------------------------------------------------------------------------

async function writeRegistryItem(folderPath, items, source, slug, fetchedFrom, fetchedAt, listSource, nonRenderableReason = null) {
  const allFiles = (await fs.readdir(folderPath))
    .filter(f => /\.(tsx?|jsx?)$/.test(f))
    .map(f => ({
      path: f,
      type: /demo/i.test(f) ? 'registry:example' : 'registry:ui',
    }))

  const isRenderable = !nonRenderableReason
  const preview = {
    width: 400,
    height: 300,
    background: 'neutral-950',
    interactive: false,
  }
  if (!isRenderable) {
    preview.renderable = false
    preview.reason = nonRenderableReason
  }

  const ourRegistry = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: slug,
    type: 'registry:ui',
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: `Installed from ${fetchedFrom}`,
    source,
    platform: 'Mixed',
    tags: [source, slug],
    files: allFiles,
    dependencies: allDependencies(items.map(i => i.item)),
    registryDependencies: [],
    preview,
    // Phase 6 provenance
    _provenance: {
      fetchedFrom,
      fetchedAt,
      importMode: 'bulk',
      importedFromList: listSource,
    },
  }
  await fs.writeFile(
    path.join(folderPath, 'registry-item.json'),
    JSON.stringify(ourRegistry, null, 2)
  )
}

// ---------------------------------------------------------------------------
// Main import loop
// ---------------------------------------------------------------------------

async function importComponents(registryConfig, options) {
  const { source, limit, concurrency = 8, dryRun, force } = options
  const libSourcePath = path.join(LIB_ROOT, source)

  // Check existing manifest for idempotency
  const manifest = await readExistingManifest()
  const existing = new Set(
    manifest?.components?.map(c => `${c.source}/${c.name}`) ?? []
  )

  // Fetch list
  let entries
  if (registryConfig.sitemapUrl) {
    entries = await fetch21stDevList(registryConfig.sitemapUrl)
  } else if (registryConfig.listUrl) {
    entries = await fetchRegistryList(registryConfig.listUrl)
  } else {
    throw new Error(`No list endpoint configured for source: ${source}`)
  }

  // Apply limit
  if (limit) entries = entries.slice(0, limit)

  if (dryRun) {
    for (const e of entries) {
      const fn = registryConfig.folderNameFn(e)
      const url = registryConfig.itemUrlFn(e)
      const alreadyExists = existing.has(`${source}/${fn}`)
      console.log(`  [DRY] ${alreadyExists ? 'skip   ' : 'fetch  '} ${url}`)
    }
    return { attempted: entries.length, dryRun: true }
  }

  // Semaphore for concurrency control
  let active = 0
  const queue = [...entries]
  const results = []

  const startTime = new Date().toISOString()

  const stats = {
    // written_items: every registry-item.json written (includes deps + components)
    written_items: 0,
    // manifest_visible: components that have a demo.tsx (user-facing)
    manifest_visible: 0,
    // marked_non_renderable: components flagged with preview.renderable=false
    marked_non_renderable: 0,
    skipped_existing: 0,
    skipped_empty_json: 0,
    failed_404: 0,
    failed_5xx: 0,
    failed_other: 0,
    failures: [],
  }

  async function worker() {
    while (queue.length > 0) {
      const entry = queue.shift()
      if (!entry) break

      const fn = registryConfig.folderNameFn(entry)
      const itemUrl = registryConfig.itemUrlFn(entry)
      const folderPath = path.join(libSourcePath, fn)
      const alreadyExists = existing.has(`${source}/${fn}`) && existsSync(path.join(folderPath, 'registry-item.json'))

      if (alreadyExists && !force) {
        process.stderr.write(`  skip   ${itemUrl} (already exists)\n`)
        stats.skipped_existing++
        results.push({ url: itemUrl, reason: 'already_exists' })
        continue
      }

      process.stderr.write(`  fetch  ${itemUrl}...\n`)

      try {
        const visited = new Set()
        const items = []
        await resolveRegistryItem(itemUrl, visited, items)

        if (!items.length) {
          process.stderr.write(`         EMPTY body — skipping\n`)
          stats.skipped_empty_json++
          results.push({ url: itemUrl, reason: 'empty_json_body' })
          continue
        }

        const fetchedAt = new Date().toISOString()

        // Detect unresolvable imports (e.g. @/demos/*) before writing
        let nonRenderableReason = null
        for (const { item } of items) {
          for (const f of item.files || []) {
            const { hasUnresolvable, reason } = detectUnresolvableImports(f.content ?? '')
            if (hasUnresolvable) {
              nonRenderableReason = reason
              break
            }
          }
          if (nonRenderableReason) break
        }

        await writeComponentFiles(folderPath, items)
        await ensureDemo(folderPath, items)

        // Second pass: after files are on disk, verify relative sibling imports resolve.
        // Catches ./avatar, ./utils etc. when the scraper didn't pull them in as
        // registryDependencies. We can't know these are missing until all writes finish.
        if (!nonRenderableReason) {
          const { missing } = await findMissingSiblings(folderPath)
          if (missing.length) {
            nonRenderableReason = `missing relative sibling imports: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` (+${missing.length - 3} more)` : ''}`
          }
        }

        // If non-renderable, replace demo.tsx with a neutral stub so webpack's
        // dynamic-import glob in PreviewRenderer.tsx doesn't try to compile the
        // broken source at build time. Runtime fallback is handled by Card.tsx
        // based on preview.renderable.
        if (nonRenderableReason) {
          const demoPath = path.join(folderPath, 'demo.tsx')
          try {
            await fs.access(demoPath)
            const stub = `"use client"\n// Auto-stubbed by bulk-import.mjs — original demo had unresolvable imports.\nexport default function DemoOne() {\n  return <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">Code reference only</div>\n}\n`
            await fs.writeFile(demoPath, stub)
          } catch {}
        }

        await writeRegistryItem(folderPath, items, source, fn, itemUrl, fetchedAt, registryConfig.listSource, nonRenderableReason)

        process.stderr.write(`         ok → ${folderPath}${nonRenderableReason ? ' [NON-RENDERABLE: ' + nonRenderableReason + ']' : ''}\n`)
        stats.written_items++
        if (nonRenderableReason) {
          stats.marked_non_renderable++
        } else {
          // Has demo.tsx — user-facing component visible in manifest
          stats.manifest_visible++
        }
        results.push({ url: itemUrl, reason: 'ok', nonRenderable: !!nonRenderableReason })
      } catch (e) {
        const msg = e.message ?? String(e)
        let reason = 'failed_other'
        if (msg.includes('404')) reason = 'failed_404'
        else if (msg.includes('500') || msg.includes('502') || msg.includes('503')) reason = 'failed_5xx'

        process.stderr.write(`         FAIL: ${msg}\n`)
        stats[reason]++
        stats.failures.push({ url: itemUrl, reason: msg })
        results.push({ url: itemUrl, reason: msg })
      }
    }
  }

  // Start N workers
  const workers = []
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker())
  }
  await Promise.all(workers)

  const finishedAt = new Date().toISOString()

  return {
    attempted: entries.length,
    written_items: stats.written_items,
    manifest_visible: stats.manifest_visible,
    marked_non_renderable: stats.marked_non_renderable,
    skipped_existing: stats.skipped_existing,
    skipped_empty_json: stats.skipped_empty_json,
    failed_404: stats.failed_404,
    failed_5xx: stats.failed_5xx,
    failed_other: stats.failed_other,
    failures: stats.failures,
    startedAt: startTime,
    finishedAt,
    source,
  }
}

// ---------------------------------------------------------------------------
// Failure log writer
// ---------------------------------------------------------------------------

async function writeFailureLog(runResult) {
  const timestamp = runResult.startedAt.replace(/[:.]/g, '-').slice(0, 19)
  const logPath = path.join(ROOT, '.claude', `scrape-failures-${runResult.source}-${timestamp}.json`)
  await fs.mkdir(path.dirname(logPath), { recursive: true })
  await fs.writeFile(logPath, JSON.stringify(runResult, null, 2), 'utf-8')
  console.log(`[bulk-import] failure log → ${logPath}`)
}

// ---------------------------------------------------------------------------
// Manifest regenerator
// ---------------------------------------------------------------------------

async function regenerateManifest() {
  const { exec } = await import('node:child_process')
  await new Promise((resolve, reject) => {
    exec(
      `node "${path.join(ROOT, 'scripts', 'build-manifest.mjs')}"`,
      { cwd: ROOT },
      (err, stdout, stderr) => {
        if (err) {
          console.error('[bulk-import] manifest rebuild failed:', stderr)
          reject(err)
        } else {
          console.log('[bulk-import] manifest regenerated')
          resolve()
        }
      }
    )
  })
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = {}
  for (const arg of process.argv.slice(2)) {
    const m = arg.match(/^--([^=\s]+)(?:=(.*))?$/)
    if (m) args[m[1]] = m[2] ?? true
  }
  return args
}

async function main() {
  const args = parseArgs()

  const source = args.source
  if (!source) {
    console.error('Usage: node scripts/bulk-import.mjs --source=<name> [--limit=N] [--concurrency=8] [--dry-run] [--force]')
    console.error('Sources:', Object.keys(REGISTRIES).join(', '))
    process.exit(1)
  }

  const registry = REGISTRIES[source]
  if (!registry) {
    console.error(`Unknown source: ${source}`)
    process.exit(1)
  }

  if (registry.DISABLED) {
    console.error(`[bulk-import] Source '${source}' is disabled (TODO). See REGISTRIES config for details.`)
    process.exit(1)
  }

  const options = {
    source,
    limit: args.limit ? parseInt(args.limit, 10) : undefined,
    concurrency: args.concurrency ? parseInt(args.concurrency, 10) : 8,
    dryRun: args['dry-run'] === true,
    force: args.force === true,
  }

  console.log(`[bulk-import] Starting bulk import for '${source}'`)
  console.log(`[bulk-import] Options: limit=${options.limit ?? 'none'}, concurrency=${options.concurrency}, dryRun=${options.dryRun}, force=${options.force}`)

  const result = await importComponents(registry, options)

  if (!options.dryRun) {
    await writeFailureLog(result)
    await regenerateManifest()
  }

  console.log(`[bulk-import] done.`)
  console.log(`  attempted: ${result.attempted}`)
  console.log(`  written_items: ${result.written_items}  (includes dependency-only)`)
  console.log(`  manifest_visible: ${result.manifest_visible}  (user-facing components with demo)`)
  console.log(`  marked_non_renderable: ${result.marked_non_renderable}  (flagged renderable=false)`)
  console.log(`  skipped_existing: ${result.skipped_existing ?? 0}`)
  console.log(`  skipped_empty: ${result.skipped_empty_json ?? 0}`)
  console.log(`  failed_404: ${result.failed_404 ?? 0}`)
  console.log(`  failed_5xx: ${result.failed_5xx ?? 0}`)
  if (result.failures?.length) {
    console.log(`[bulk-import] ${result.failures.length} failures — see failure log for details`)
  }
}

main().catch(e => {
  console.error('[bulk-import] FATAL:', e.message)
  process.exit(1)
})
