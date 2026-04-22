#!/usr/bin/env node
/**
 * Add a component from 21st.dev's public registry.
 *
 * Usage:
 *   node scripts/add-21st.mjs https://21st.dev/community/components/aliimam/gallery/default
 *   node scripts/add-21st.mjs aliimam/gallery
 *
 * Pulls the component JSON from 21st.dev/r/{user}/{slug}, writes files to
 * library/21st-dev/{user}-{slug}/, generates registry-item.json in our format.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const LIB_ROOT = path.join(REPO_ROOT, 'library/21st-dev')

function parseUrl(input) {
  const m = input.match(/(?:21st\.dev\/(?:community\/components|r))\/([^/]+)\/([^/?#]+)/)
  if (m) return { user: m[1], slug: m[2] }
  const parts = input.split('/').filter(Boolean)
  if (parts.length === 2) return { user: parts[0], slug: parts[1] }
  throw new Error(`Couldn't parse from: ${input}`)
}

async function fetchRegistryItem(user, slug) {
  const url = `https://21st.dev/r/${user}/${slug}`
  process.stderr.write(`  fetching ${url}... `)
  const res = await fetch(url)
  if (!res.ok) {
    process.stderr.write(`FAILED (${res.status})\n`)
    throw new Error(`HTTP ${res.status} from ${url}`)
  }
  const json = await res.json()
  process.stderr.write(`ok\n`)
  return json
}

function shortNameFromPath(p) {
  return path.basename(p).replace(/\.(tsx?|jsx?|css|scss|mdx?)$/, '')
}

function allDependencies(items) {
  const deps = new Set()
  for (const item of items) {
    for (const d of item.dependencies || []) deps.add(d)
  }
  return [...deps].sort()
}

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: node scripts/add-21st.mjs <21st.dev-url-or-user/slug>')
    process.exit(1)
  }

  const { user, slug } = parseUrl(arg)
  const folderName = `${user}-${slug}`.toLowerCase()
  const folderPath = path.join(LIB_ROOT, folderName)

  console.log(`\n[add-21st] ${user}/${slug} -> library/21st-dev/${folderName}/`)

  const visited = new Set()
  const items = []
  async function resolve(u, s) {
    const key = `${u}/${s}`
    if (visited.has(key)) return
    visited.add(key)
    const item = await fetchRegistryItem(u, s)
    items.push(item)
    for (const dep of item.registryDependencies || []) {
      if (typeof dep !== 'string') continue
      if (dep.startsWith('http')) {
        const m = dep.match(/21st\.dev\/r\/([^/]+)\/([^/?#]+)/)
        if (m) await resolve(m[1], m[2])
      } else {
        await resolve('shadcn', dep)
      }
    }
  }
  await resolve(user, slug)

  await fs.mkdir(folderPath, { recursive: true })
  for (const item of items) {
    for (const f of item.files || []) {
      const base = shortNameFromPath(f.path)
      const ext = path.extname(f.path) || '.tsx'
      const outName = `${base}${ext}`
      const outPath = path.join(folderPath, outName)
      let content = f.content
      content = content.replace(/from\s+["']@\/components\/ui\/([a-z0-9-]+)["']/g, 'from "./$1"')
      content = content.replace(/from\s+["']@\/lib\/utils["']/g, 'from "../_utils/cn"')
      await fs.writeFile(outPath, content)
      console.log(`  wrote ${outName} (${content.length} bytes)`)
    }
  }

  const hasDemo = items.some(i => i.files?.some(f => /demo/i.test(f.path)))
  if (!hasDemo) {
    const main = items[0]
    const mainFile = main.files[0]
    const mainBase = shortNameFromPath(mainFile.path)
    const exportMatch = mainFile.content.match(/export\s+(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/)
    const exportName = exportMatch ? exportMatch[1] : 'Component'
    const demoContent = `"use client"\nimport { ${exportName} } from "./${mainBase}"\n\nexport default function DemoOne() {\n  return (\n    <div className="flex h-full w-full items-center justify-center p-6">\n      <${exportName} />\n    </div>\n  )\n}\n`
    await fs.writeFile(path.join(folderPath, 'demo.tsx'), demoContent)
    console.log(`  wrote demo.tsx (auto-generated, exports ${exportName})`)
  }

  const mainItem = items[0]
  const allFiles = await fs.readdir(folderPath)
  const filesArray = allFiles
    .filter(f => /\.(tsx?|jsx?)$/.test(f))
    .map(f => ({
      path: f,
      type: /demo/i.test(f) ? 'registry:example' : 'registry:ui',
    }))

  const ourRegistry = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: folderName,
    type: 'registry:ui',
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: `Installed from 21st.dev/${user}/${slug}`,
    source: '21st-dev',
    platform: 'Mixed',
    tags: ['21st-dev', user, slug],
    files: filesArray,
    dependencies: allDependencies(items),
    registryDependencies: [],
    preview: {
      width: 400,
      height: 300,
      background: 'neutral-950',
      interactive: false,
    },
    _provenance: {
      fetchedFrom: `https://21st.dev/r/${user}/${slug}`,
      fetchedAt: new Date().toISOString(),
    },
  }
  await fs.writeFile(path.join(folderPath, 'registry-item.json'), JSON.stringify(ourRegistry, null, 2))
  console.log(`  wrote registry-item.json`)

  console.log(`\n[add-21st] done. refresh viewer to see it.`)
}

main().catch(e => {
  console.error('[add-21st] FAILED:', e.message)
  process.exit(1)
})
