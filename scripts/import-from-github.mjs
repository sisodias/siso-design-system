#!/usr/bin/env node
/**
 * scripts/import-from-github.mjs
 *
 * GitHub-backed scraper for bot-shielded libraries with open repos.
 *
 * Sources:
 *   motion-primitives — ibelick/motion-primitives — ~33 animation components
 *   kokonutui         — kokonut-labs/kokonutui   — ~40 UI components
 *   reactbits         — DavidHDev/react-bits      — SKIPPED (jsrepo format, different schema)
 *
 * Policy:
 *   - Concurrency 4 default (GitHub raw: 60/hr anonymous, 5000/hr authenticated)
 *   - $GITHUB_TOKEN in env → adds Bearer auth to raise rate limit
 *   - 2 retries on 5xx; permanent skip on 404
 *   - Content is embedded in individual item JSONs — no sub-dependency fetching needed
 *   - Idempotent — skips folders already in manifest
 *   - Phase 6 provenance: importMode="bulk", importedFromList="github/{owner}/{repo}"
 *   - Regenerates library/manifest.json at end of run
 *
 * CLI:
 *   node scripts/import-from-github.mjs --source=<name> [--limit=N] [--concurrency=4] [--dry-run] [--force]
 *
 *   Sources: motion-primitives, kokonutui
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
// REGISTRY configs
// ---------------------------------------------------------------------------

const REGISTRIES = {
  'motion-primitives': {
    owner: 'ibelick',
    repo: 'motion-primitives',
    branch: 'main',
    // Registry index listing (no content)
    registryListUrl: 'https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/registry.json',
    // Individual item with embedded content
    itemUrlFn: (slug) => `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/${slug}.json`,
    listSource: 'github/ibelick/motion-primitives',
    fetchedFromBase: 'https://github.com/ibelick/motion-primitives',
    // Paths in JSON files: "accordion.tsx" → write as-is
    pathTransform: (p) => p.replace(/^components\/core\//, ''),
  },

  'kokonutui': {
    owner: 'kokonut-labs',
    repo: 'kokonutui',
    branch: 'main',
    registryListUrl: 'https://raw.githubusercontent.com/kokonut-labs/kokonutui/main/public/r/registry.json',
    itemUrlFn: (slug) => `https://raw.githubusercontent.com/kokonut-labs/kokonutui/main/public/r/${slug}.json`,
    listSource: 'github/kokonut-labs/kokonutui',
    fetchedFromBase: 'https://github.com/kokonut-labs/kokonutui',
    // Paths in JSON files: "/components/kokonutui/ai-prompt.tsx" → "ai-prompt.tsx"
    pathTransform: (p) => p.replace(/^\/components\/kokonutui\//, ''),
  },

  // SKIPPED — jsrepo format with 4 variants per component (JS-CSS, JS-TW, TS-CSS, TS-TW)
  // Each variant is a separate file; registry structure is fundamentally different.
  // Would need a separate jsrepo adapter. Leaving as stub for future work.
  'reactbits': {
    owner: 'DavidHDev',
    repo: 'react-bits',
    branch: 'main',
    registryListUrl: null,
    itemUrlFn: () => null,
    listSource: 'github/DavidHDev/react-bits',
    fetchedFromBase: 'https://github.com/DavidHDev/react-bits',
    pathTransform: (p) => p,
    DISABLED: true,
    SKIP_REASON: 'jsrepo format — 4 variants per component, different schema; needs separate adapter',
  },
}

// ---------------------------------------------------------------------------
// Re-exported helpers from bulk-import.mjs
// ---------------------------------------------------------------------------

function shortNameFromPath(p) {
  return path.basename(p).replace(/\.(tsx?|jsx?|css|scss|mdx?)$/, '')
}

function detectUnresolvableImports(content) {
  const demosMatch = content.match(/from\s+["']@\/demos\/([^"']+)["']/)
  if (demosMatch) {
    return { hasUnresolvable: true, reason: `imports 21st.dev internal demo harness (@/demos/${demosMatch[1]})` }
  }
  const lines = content.split('\n')
  for (const line of lines) {
    const m = line.match(/from\s+["']@\/([^"']+)["']/)
    if (m) {
      const p = m[1]
      // These two are handled by rewriteImports; anything else is unresolvable
      if (!p.startsWith('components/ui/') && p !== 'lib/utils' && !p.startsWith('hooks/')) {
        return { hasUnresolvable: true, reason: `imports unresolvable path (@/${p})` }
      }
    }
    const cssMatch = line.match(/import\s+["'](\.\.\/\.\.\/[^"']+\.css)["']/)
    if (cssMatch) {
      return { hasUnresolvable: true, reason: `imports parent CSS (${cssMatch[1]})` }
    }
  }
  return { hasUnresolvable: false, reason: null }
}

async function findMissingSiblings(folderPath) {
  const missing = new Set()
  let entries
  try {
    entries = await fs.readdir(folderPath)
  } catch {
    return { missing: [] }
  }
  const files = entries.filter(f => /\.(tsx?|jsx?)$/.test(f))
  const existingBases = new Set(
    entries.map(e => e.replace(/\.(tsx?|jsx?|css|scss|json)$/, ''))
  )
  for (const f of files) {
    let content
    try {
      content = await fs.readFile(path.join(folderPath, f), 'utf-8')
    } catch {
      continue
    }
    const lines = content.split('\n')
    for (const line of lines) {
      const m = line.match(/from\s+["'](\.\/[^"']+)["']/)
      if (!m) continue
      const importPath = m[1]
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
    .replace(/from\s+["']@\/hooks\/([^"']+)["']/g, 'from "../hooks/$1"')
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
// Fetch with GitHub token support + retry
// ---------------------------------------------------------------------------

function buildHeaders() {
  const headers = { 'Accept': 'application/json' }
  const token = process.env.GITHUB_TOKEN
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function fetchWithRetry(url, retries = 2) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: buildHeaders() })
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
        return { status: 200, body: null }
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
// Registry list fetcher
// ---------------------------------------------------------------------------

async function fetchRegistryList(registryConfig) {
  const { status, body } = await fetchWithRetry(registryConfig.registryListUrl)
  if (status !== 200 || !body) {
    throw new Error(`Registry list fetch failed: status=${status}, url=${registryConfig.registryListUrl}`)
  }
  // Both motion-primitives and kokonutui use { items: [...] } wrapper
  const items = body.items || []
  return items.map(item => ({ slug: item.name, data: item }))
}

// ---------------------------------------------------------------------------
// Item fetcher — fetches the item JSON with embedded content
// ---------------------------------------------------------------------------

async function fetchItem(registryConfig, slug) {
  const url = registryConfig.itemUrlFn(slug)
  if (!url) return null
  const { status, body } = await fetchWithRetry(url)
  if (status === 404) return null
  if (status !== 200 || !body) return null
  return body
}

// ---------------------------------------------------------------------------
// File writer — writes component files with import rewrites
// ---------------------------------------------------------------------------

async function writeComponentFiles(folderPath, item, pathTransform) {
  await fs.mkdir(folderPath, { recursive: true })
  for (const f of item.files || []) {
    const rawPath = f.path || ''
    // Apply per-repo path normalization (strip directory prefixes)
    const normalizedPath = pathTransform(rawPath)
    if (!normalizedPath) continue

    const base = shortNameFromPath(normalizedPath)
    const ext = path.extname(normalizedPath) || '.tsx'
    const outName = `${base}${ext}`
    const outPath = path.join(folderPath, outName)

    const content = rewriteImports(f.content ?? '')
    await fs.writeFile(outPath, content)
  }
}

// ---------------------------------------------------------------------------
// Demo file generator
// ---------------------------------------------------------------------------

async function ensureDemo(folderPath, item) {
  const hasDemo = (item.files || []).some(f => /demo/i.test(f.path))
  if (hasDemo) return

  const mainFile = item.files?.[0]
  if (!mainFile) return

  const mainBase = shortNameFromPath(mainFile.path)
  const exportMatch = (mainFile.content ?? '').match(/export\s+(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/)
  const exportName = exportMatch ? exportMatch[1] : 'Component'

  const demoContent = `"use client"\nimport { ${exportName} } from "./${mainBase}"\n\nexport default function DemoOne() {\n  return (\n    <div className="flex h-full w-full items-center justify-center p-6">\n      <${exportName} />\n    </div>\n  )\n}\n`
  await fs.writeFile(path.join(folderPath, 'demo.tsx'), demoContent)
}

// ---------------------------------------------------------------------------
// registry-item.json builder (Phase 6 provenance)
// ---------------------------------------------------------------------------

async function writeRegistryItem(folderPath, item, source, slug, registryConfig, fetchedAt, nonRenderableReason = null) {
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

  // Collect all dependencies across all files in the item
  const allFilesDeps = allDependencies(item.files ? [item] : [])

  const ourRegistry = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: slug,
    type: 'registry:ui',
    title: (item.title || slug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: item.description || `Installed from ${registryConfig.fetchedFromBase}`,
    source,
    platform: 'Mixed',
    tags: [source, slug],
    files: allFiles,
    dependencies: item.dependencies || [],
    registryDependencies: item.registryDependencies || [],
    preview,
    // Phase 6 provenance
    _provenance: {
      fetchedFrom: `${registryConfig.fetchedFromBase}/tree/${registryConfig.branch}/public`,
      fetchedAt,
      importMode: 'bulk',
      importedFromList: registryConfig.listSource,
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
  const { source, limit, concurrency = 4, dryRun, force } = options
  const libSourcePath = path.join(LIB_ROOT, source)

  // Check existing manifest for idempotency
  let existing = new Set()
  try {
    const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf-8'))
    existing = new Set(manifest?.components?.map(c => `${c.source}/${c.name}`) ?? [])
  } catch {}

  // Fetch list
  let entries
  try {
    entries = await fetchRegistryList(registryConfig)
  } catch (e) {
    console.error(`[import-from-github] Failed to fetch registry list: ${e.message}`)
    throw e
  }

  if (limit) entries = entries.slice(0, limit)

  if (dryRun) {
    for (const e of entries) {
      const url = registryConfig.itemUrlFn(e.slug)
      const alreadyExists = existing.has(`${source}/${e.slug}`)
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
    written_items: 0,
    manifest_visible: 0,
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

      const { slug } = entry
      const itemUrl = registryConfig.itemUrlFn(slug)
      const folderPath = path.join(libSourcePath, slug)
      const alreadyExists = existing.has(`${source}/${slug}`) && existsSync(path.join(folderPath, 'registry-item.json'))

      if (alreadyExists && !force) {
        process.stderr.write(`  skip   ${itemUrl} (already exists)\n`)
        stats.skipped_existing++
        results.push({ slug, reason: 'already_exists' })
        continue
      }

      process.stderr.write(`  fetch  ${itemUrl}...\n`)

      try {
        const item = await fetchItem(registryConfig, slug)

        if (!item || !item.files?.length) {
          process.stderr.write(`         EMPTY body — skipping\n`)
          stats.skipped_empty_json++
          results.push({ slug, reason: 'empty_json_body' })
          continue
        }

        const fetchedAt = new Date().toISOString()

        // Detect unresolvable imports before writing
        let nonRenderableReason = null
        for (const f of item.files || []) {
          const { hasUnresolvable, reason } = detectUnresolvableImports(f.content ?? '')
          if (hasUnresolvable) {
            nonRenderableReason = reason
            break
          }
        }

        await writeComponentFiles(folderPath, item, registryConfig.pathTransform)
        await ensureDemo(folderPath, item)

        // After files are on disk, verify relative sibling imports resolve
        if (!nonRenderableReason) {
          const { missing } = await findMissingSiblings(folderPath)
          if (missing.length) {
            nonRenderableReason = `missing relative sibling imports: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` (+${missing.length - 3} more)` : ''}`
          }
        }

        // Stub demo if non-renderable
        if (nonRenderableReason) {
          const demoPath = path.join(folderPath, 'demo.tsx')
          try {
            await fs.access(demoPath)
            const stub = `"use client"\n// Auto-stubbed by import-from-github.mjs — original demo had unresolvable imports.\nexport default function DemoOne() {\n  return <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">Code reference only</div>\n}\n`
            await fs.writeFile(demoPath, stub)
          } catch {}
        }

        await writeRegistryItem(folderPath, item, source, slug, registryConfig, fetchedAt, nonRenderableReason)

        process.stderr.write(`         ok → ${folderPath}${nonRenderableReason ? ' [NON-RENDERABLE: ' + nonRenderableReason + ']' : ''}\n`)
        stats.written_items++
        if (nonRenderableReason) {
          stats.marked_non_renderable++
        } else {
          stats.manifest_visible++
        }
        results.push({ slug, reason: 'ok', nonRenderable: !!nonRenderableReason })
      } catch (e) {
        const msg = e.message ?? String(e)
        let reason = 'failed_other'
        if (msg.includes('404')) reason = 'failed_404'
        else if (msg.includes('500') || msg.includes('502') || msg.includes('503')) reason = 'failed_5xx'

        process.stderr.write(`         FAIL: ${msg}\n`)
        stats[reason]++
        stats.failures.push({ slug, reason: msg })
        results.push({ slug, reason: msg })
      }

      // GitHub raw rate limit courtesy: small delay between requests
      await new Promise(r => setTimeout(r, 100))
    }
  }

  // Start N workers with controlled concurrency
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
  console.log(`[import-from-github] failure log → ${logPath}`)
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
          console.error('[import-from-github] manifest rebuild failed:', stderr)
          reject(err)
        } else {
          console.log('[import-from-github] manifest regenerated')
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
    console.error('Usage: node scripts/import-from-github.mjs --source=<name> [--limit=N] [--concurrency=4] [--dry-run] [--force]')
    console.error('Sources:', Object.keys(REGISTRIES).filter(k => !REGISTRIES[k].DISABLED).join(', '))
    console.error('Disabled:', Object.entries(REGISTRIES).filter(([, v]) => v.DISABLED).map(([k, v]) => `${k} (${v.SKIP_REASON})`).join('; '))
    process.exit(1)
  }

  const registry = REGISTRIES[source]
  if (!registry) {
    console.error(`Unknown source: ${source}`)
    process.exit(1)
  }

  if (registry.DISABLED) {
    console.error(`[import-from-github] Source '${source}' is disabled. Reason: ${registry.SKIP_REASON}`)
    process.exit(1)
  }

  const options = {
    source,
    limit: args.limit ? parseInt(args.limit, 10) : undefined,
    concurrency: args.concurrency ? parseInt(args.concurrency, 10) : 4,
    dryRun: args['dry-run'] === true,
    force: args.force === true,
  }

  console.log(`[import-from-github] Starting GitHub import for '${source}'`)
  console.log(`[import-from-github] Options: limit=${options.limit ?? 'none'}, concurrency=${options.concurrency}, dryRun=${options.dryRun}, force=${options.force}`)

  const result = await importComponents(registry, options)

  if (!options.dryRun) {
    await writeFailureLog(result)
    await regenerateManifest()
  }

  console.log(`[import-from-github] done.`)
  console.log(`  attempted: ${result.attempted}`)
  console.log(`  written_items: ${result.written_items}`)
  console.log(`  manifest_visible: ${result.manifest_visible}  (user-facing components with demo)`)
  console.log(`  marked_non_renderable: ${result.marked_non_renderable}  (flagged renderable=false)`)
  console.log(`  skipped_existing: ${result.skipped_existing ?? 0}`)
  console.log(`  skipped_empty: ${result.skipped_empty_json ?? 0}`)
  console.log(`  failed_404: ${result.failed_404 ?? 0}`)
  console.log(`  failed_5xx: ${result.failed_5xx ?? 0}`)
  if (result.failures?.length) {
    console.log(`[import-from-github] ${result.failures.length} failures — see failure log for details`)
  }
}

main().catch(e => {
  console.error('[import-from-github] FATAL:', e.message)
  process.exit(1)
})
