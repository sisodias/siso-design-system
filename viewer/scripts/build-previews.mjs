#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VIEWER_ROOT = path.resolve(__dirname, '..')
const SRC_ROOT = path.resolve(VIEWER_ROOT, '../_external/21st-dev')
const DST_ROOT = path.resolve(VIEWER_ROOT, 'app/_previews')
const SKIP_ROOT = path.resolve(VIEWER_ROOT, 'app/_previews/_skipped')

// Slugs that are known to fail due to missing heavy deps or broken demos
const SKIP_LIST = new Set([
  'loader-15',           // uses styled-components + react-spring (heavy transitive deps)
  'resizable-table',     // uses react-resizable + react-resizable-panels + next-themes
  'analytics-card',       // broken demo: imports AnalyticsCard from card (card.tsx doesn't export it)
  'freelancer-stats-card',// broken demo: imports FreelancerStatsCard from non-existent stats-card
  'security-card',        // imports ../../index.css + react-icons/io (not installed)
  'circular-navigation',  // broken demo: imports cicular-navigation-bar (typo) — no such component
  'notifications-menu',   // broken demo: imports tabs (not in bank) + card (path issues)
  'stacked-diverging-bar', // uses reaviz (heavy charting lib, skip as instructed)
  'statistics-card-13',   // uses CardToolbar (card.tsx doesn't export) + button-1 variant (not in shims)
  'agent-plan',           // TypeScript: type: string incompatible with AnimationGeneratorType in motion v12
  'bar-chart',           // TypeScript: payload prop type mismatch with recharts v3
  'radial-chart',        // TypeScript: payload prop type mismatch with recharts v3
  'card-8',             // TypeScript: same motion type: string issue in cardVariants
  'glass-card',        // lucide-react doesn't export Instagram/Twitter — icons renamed in newer versions
  'ia-siri-chat',      // TypeScript: useRef<NodeJS.Timeout>() needs initial arg in strict mode
  'radial-orbital-timeline', // TypeScript: ref callback returns null instead of void in React 19
  'sean-avatar',          // uses old @radix-ui/primitives API (Avatar.Root) not available in new packages
  'sean-badge',          // uses bare 'radix-ui' → @radix-ui/react-avatar (wrong — Slot is from react-slot)
  'sean-button',         // likely same bare radix-ui issue
  'sean-card',           // likely same bare radix-ui issue
  'sean-dropdown-menu',  // likely same bare radix-ui issue
  'search-bar',          // TypeScript: ease: string incompatible with motion v12 Easing type
  'social-post-card',   // TypeScript: CardProps not defined (pre-existing bug in source)
  'visualize-booking',  // TypeScript: onDrag event type incompatible with motion div in React 19
])

// Aliases: demo import slug → actual folder slug in 21st-dev
const ALIAS_MAP = {
  'cicular-navigation-bar': 'circular-navigation', // typo in demo.tsx
  'stats-card': 'stats-card-2', // freelancer-stats-card demo refs wrong name
}

async function main() {
  // Clean stale previews (preserve _utils/, _skipped/)
  try {
    const existing = await fs.readdir(DST_ROOT, { withFileTypes: true })
    for (const e of existing) {
      if (e.isDirectory() && !e.name.startsWith('_')) {
        await fs.rm(path.join(DST_ROOT, e.name), { recursive: true, force: true })
      }
    }
  } catch {}

  // Clean skipped
  try {
    await fs.rm(SKIP_ROOT, { recursive: true, force: true })
  } catch {}

  await fs.mkdir(DST_ROOT, { recursive: true })

  const entries = await fs.readdir(SRC_ROOT, { withFileTypes: true })

  // Discover all valid component slugs (folders that exist)
  const knownSlugs = new Set(
    entries.filter(e => e.isDirectory()).map(e => e.name)
  )

  let built = 0
  let skipped = 0
  const builtSlugs = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const slug = entry.name
    const srcDir = path.join(SRC_ROOT, slug)
    const dstDir = path.join(DST_ROOT, slug)

    // Handle skipped components — just log and move on (no files written)
    if (SKIP_LIST.has(slug)) {
      console.log(`[skip] ${slug}`)
      skipped++
      continue
    }

    await fs.mkdir(dstDir, { recursive: true })
    const files = await fs.readdir(srcDir)

    for (const f of files) {
      if (!f.endsWith('.tsx') && !f.endsWith('.ts')) continue
      const srcPath = path.join(srcDir, f)
      const stat = await fs.stat(srcPath)
      if (!stat.isFile()) continue

      let content = await fs.readFile(srcPath, 'utf-8')

      // Rewrite @/components/ui/{ref} → proper relative path
      content = content.replace(
        /from\s+["']@\/components\/ui\/([a-z0-9-]+)["']/g,
        (match, ref) => {
          const aliased = ALIAS_MAP[ref] || ref
          if (aliased === slug) {
            // Same folder — component imports itself
            return `from "./${ref}"`
          }
          if (knownSlugs.has(aliased)) {
            return `from "../${aliased}/${aliased}"`
          }
          // Unknown component — shim
          return `from "../_utils/ui-shims"`
        }
      )

      // Rewrite @/lib/utils → ../_utils/cn
      content = content.replace(
        /from\s+["']@\/lib\/utils["']/g,
        'from "../_utils/cn"'
      )

      // Rewrite @/hooks/* → stub
      content = content.replace(
        /from\s+["']@\/hooks\/([a-z0-9-]+)["']/g,
        'from "../_utils/stub-hook"'
      )

      // Strip CSS imports (e.g. ../../index.css, react-resizable/css/styles.css)
      content = content.replace(/^import\s+["'][^"']*\.css["'];?\n?/gm, '')

      // Fix lucide-react typo: Github → GitHub (lucide exports GitHub, not Github)
      content = content.replace(
        /import\s+\{([^}]*)\}\s+from\s+["']lucide-react["']/g,
        (_, imports) => _.replace(/(^|[,\s])Github([,\s}]|$)/g, '$1GitHub$2')
      )

      // Fix motion v12 type: "spring" / "tween" / "inertia" must be typed as const
      // e.g. type: "spring" → type: "spring" as const
      content = content.replace(
        /type:\s*(["'])(spring|tween|inertia|keyframes)\1(\s*[,}])/g,
        'type: "$2" as const$3'
      )

      // Fix motion ease: string → ease: "linear" as const (known easing strings)
      content = content.replace(
        /ease:\s*(["'])(linear|ease|ease-in|ease-out|ease-in-out)\1(\s*[,}])/g,
        'ease: "$2" as const$3'
      )

      await fs.writeFile(path.join(dstDir, f), content)
    }

    built++

    // Only add to manifest if the folder has a demo.tsx — otherwise it's a pure primitive
    // (e.g. shared shadcn button/card/avatar) that can't be rendered standalone.
    const dstFiles = await fs.readdir(dstDir)
    if (dstFiles.includes('demo.tsx') || dstFiles.includes('demo.ts')) {
      builtSlugs.push(slug)
    }
  }

  // Emit manifest so LivePreview knows which slugs are renderable
  const manifestPath = path.join(DST_ROOT, '_utils', 'available.json')
  await fs.writeFile(manifestPath, JSON.stringify({ slugs: builtSlugs.sort() }, null, 2))

  console.log(`[build-previews] Built: ${built}, Skipped: ${skipped}`)
}

main().catch(e => {
  console.error('[build-previews] FAILED:', e)
  process.exit(1)
})
