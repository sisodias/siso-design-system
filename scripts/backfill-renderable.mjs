#!/usr/bin/env node
/**
 * scripts/backfill-renderable.mjs
 *
 * Scan every existing component in library/{source}/{slug}/ for:
 *   - @/demos/* imports (21st.dev internal harness)
 *   - @/... imports beyond the two rewriteImports() handles
 *   - ../../*.css imports reaching outside the folder
 *   - relative sibling imports (./X) where ./X.tsx doesn't exist
 *
 * For any component with a hit, set `preview.renderable = false` + `preview.reason`
 * in that component's registry-item.json, unless it's already marked.
 *
 * One-shot recovery script. Rerun-safe. Idempotent.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIB_ROOT = path.join(ROOT, 'library')

async function scanComponent(folderPath) {
  const entries = await fs.readdir(folderPath)
  const files = entries.filter(f => /\.(tsx?|jsx?)$/.test(f))
  const existingBases = new Set(
    entries.map(e => e.replace(/\.(tsx?|jsx?|css|scss|json)$/, ''))
  )

  for (const f of files) {
    const content = await fs.readFile(path.join(folderPath, f), 'utf-8')

    // @/demos/* — 21st.dev harness
    const demos = content.match(/from\s+["']@\/demos\/([^"']+)["']/)
    if (demos) return `imports 21st.dev internal demo harness (@/demos/${demos[1]})`

    // Other @/ paths beyond known-good
    const lines = content.split('\n')
    for (const line of lines) {
      const m = line.match(/from\s+["']@\/([^"']+)["']/)
      if (m) {
        const p = m[1]
        if (!p.startsWith('components/ui/') && p !== 'lib/utils') {
          return `imports unresolvable path (@/${p})`
        }
      }
      const cssMatch = line.match(/import\s+["'](\.\.\/\.\.\/[^"']+\.css)["']/)
      if (cssMatch) return `imports parent CSS (${cssMatch[1]})`

      const rel = line.match(/from\s+["'](\.\/[^"']+)["']/)
      if (rel) {
        const base = rel[1].replace(/^\.\//, '').split('/')[0]
        if (!existingBases.has(base)) {
          return `missing relative sibling import: ${rel[1]}`
        }
      }
    }
  }
  return null
}

async function main() {
  const sources = await fs.readdir(LIB_ROOT, { withFileTypes: true })
  let scanned = 0
  let marked = 0
  let alreadyMarked = 0
  let skipped = 0

  for (const sourceEnt of sources) {
    if (!sourceEnt.isDirectory()) continue
    const source = sourceEnt.name
    const sourcePath = path.join(LIB_ROOT, source)

    const slugs = await fs.readdir(sourcePath, { withFileTypes: true })
    for (const slugEnt of slugs) {
      if (!slugEnt.isDirectory()) continue
      if (slugEnt.name.startsWith('_')) { skipped++; continue } // _utils etc.

      const folderPath = path.join(sourcePath, slugEnt.name)
      const registryPath = path.join(folderPath, 'registry-item.json')

      let registry
      try {
        registry = JSON.parse(await fs.readFile(registryPath, 'utf-8'))
      } catch {
        skipped++
        continue
      }

      scanned++

      const isAlreadyMarked = registry.preview?.renderable === false
      const reason = isAlreadyMarked ? registry.preview.reason : await scanComponent(folderPath)

      if (reason) {
        if (!isAlreadyMarked) {
          registry.preview = registry.preview || {}
          registry.preview.renderable = false
          registry.preview.reason = reason
          await fs.writeFile(registryPath, JSON.stringify(registry, null, 2))
        }

        // Always (re-)stub demo.tsx for non-renderable components. The stub must
        // NOT import from source files (which may themselves have bad imports),
        // so webpack's dynamic-import glob doesn't compile the broken source.
        // Runtime fallback is handled by Card.tsx based on preview.renderable.
        const demoPath = path.join(folderPath, 'demo.tsx')
        try {
          await fs.access(demoPath)
          const stub = `"use client"\n// Auto-stubbed by backfill-renderable.mjs — original demo/source had unresolvable imports.\nexport default function DemoOne() {\n  return <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">Code reference only</div>\n}\n`
          await fs.writeFile(demoPath, stub)
        } catch {}

        if (isAlreadyMarked) {
          alreadyMarked++
          console.log(`  [RE-STUB] ${source}/${slugEnt.name}`)
        } else {
          console.log(`  [NON-RENDERABLE] ${source}/${slugEnt.name} — ${reason}`)
          marked++
        }
      }
    }
  }

  console.log('')
  console.log(`[backfill-renderable] Done.`)
  console.log(`  scanned: ${scanned}`)
  console.log(`  newly marked non-renderable: ${marked}`)
  console.log(`  already marked (skipped): ${alreadyMarked}`)
  console.log(`  skipped (no registry / _utils): ${skipped}`)
}

main().catch(e => {
  console.error('[backfill-renderable] FAILED:', e.message)
  process.exit(1)
})
