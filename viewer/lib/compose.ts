/**
 * viewer/lib/compose.ts
 *
 * Pure helpers for building agent prompts, install commands, zip bundles,
 * and share URLs from a list of ComponentEntry objects.
 * No React, no side effects.
 */

import JSZip from 'jszip'
import { readFileSync, readdirSync, statSync } from 'fs'
import path from 'path'
import type { ComponentEntry } from './types'

// ------------------------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------------------------

export type ComposeComponent = { source: string; slug: string }
export type ComposeFormat = 'agent-prompt' | 'install' | 'zip' | 'share' | 'registry'
export type ComposeOptions = {
  brief?: string
  framework?: 'next' | 'vite' | 'remix'
  kitName?: string
  includeClassifications?: boolean
}

// ------------------------------------------------------------------------------------------------
// Agent prompt
// ------------------------------------------------------------------------------------------------

/** Normalise a value that may be a string or string[] to a display string. */
function join(val: string | string[] | undefined, fallback = 'unknown'): string {
  if (!val) return fallback
  if (Array.isArray(val)) return val.join(', ')
  return val
}

export function buildAgentPrompt(components: ComponentEntry[], options?: ComposeOptions): string {
  const brief = options?.brief?.trim() ?? ''
  const lines: string[] = [
    `You have these ${components.length} component${components.length === 1 ? '' : 's'} available for building a UI:\n`,
  ]

  components.forEach((c, i) => {
    lines.push(
      `${i + 1}. ${c.displayName} (${c.source}/${c.name})`,
      `   ${c.aiSummary ?? c.description}`,
      `   category: ${join(c.category)}`,
      `   visualStyle: ${join(c.visualStyle)}`,
      `   complexity: ${join(c.complexity)}`,
      `   platform: ${c.platform}`,
      `   Source folder: library/${c.source}/${c.name}/`,
      `   Files: ${(c.files ?? []).join(', ')}`,
      '',
    )
  })

  lines.push(
    `User brief: ${brief || '(no brief provided)'}`,
    '',
    'Constraints:',
    '- Only use the listed components; don\'t invent primitives not in the list.',
    '- Match their design language (infer from visualStyle + aiSummary).',
    '- Preserve their interactions/accessibility patterns as in source.',
    '- Use Tailwind classes; components target Next.js 15 App Router.',
    '- If a constraint in the brief conflicts with the component set, explain and propose a substitute from the list.',
  )

  return lines.join('\n')
}

// ------------------------------------------------------------------------------------------------
// Install command
// ------------------------------------------------------------------------------------------------

/**
 * Resolve a shadcn-compatible registry URL for a component, or return null.
 * Only sources with a deterministic published URL are "resolvable".
 */
function resolveShadcnUrl(entry: ComponentEntry): string | null {
  const source = entry.source
  const name = entry.name

  // 21st.dev source: use the registry endpoint pattern
  if (source === '21st-dev') {
    // Components fetched from 21st.dev store the origin in the registry item JSON.
    // Best-effort: construct the 21st.dev registry URL.
    // v2: read _provenance/fetchedFrom from the component folder.
    try {
      const folderPath = path.resolve(process.cwd(), '..', 'library', source, name)
      const provPath = path.join(folderPath, 'registry-item.json')
      const raw = readFileSync(provPath, 'utf-8')
      const prov = JSON.parse(raw)
      if (prov.fetchedFrom) return prov.fetchedFrom
      // Fallback: try to get it from the manifest origin embedded in the registry item
      if (prov.origin) return prov.origin
    } catch {
      // no-op — fall through to fallback
    }
    // Fallback URL construction based on common 21st.dev pattern
    return `https://21st.dev/r/${name}`
  }

  // motion-primitives: construct raw GitHub URL
  if (source === 'motion-primitives') {
    return `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/${name}.json`
  }

  // siso-primitives: point to our own published registry (v2 — placeholder comment)
  if (source === 'siso-primitives') {
    return null // v2: publish and use published URL
  }

  // kokonutui and others: not yet resolvable
  return null
}

export type InstallResult = {
  command: string
  resolvable: number
  fallbacks: string[]
}

export function buildInstallCommand(
  components: ComponentEntry[],
  baseUrl = 'https://siso-design-system.vercel.app',
): InstallResult {
  const urls: string[] = []
  const fallbacks: string[] = []

  for (const c of components) {
    const url = resolveShadcnUrl(c)
    if (url) {
      urls.push(`  ${url}`)
    } else {
      fallbacks.push(`# NOTE: ${c.source}/${c.name} not installable via shadcn — copy library/${c.source}/${c.name}/ manually`)
    }
  }

  const lines: string[] = []
  if (urls.length > 0) {
    lines.push('npx shadcn@latest add \\')
    lines.push(urls.join(' \\'))
    lines.push('')
  }
  for (const f of fallbacks) {
    lines.push(f)
  }

  return {
    command: lines.join('\n'),
    resolvable: urls.length,
    fallbacks,
  }
}

// ------------------------------------------------------------------------------------------------
// Zip bundle
// ------------------------------------------------------------------------------------------------

const EXCLUDE_DIRS = new Set(['.claude', 'node_modules', '.git'])
const EXCLUDE_PATTERNS = /^\.|ratings\.db/i
const INCLUDE_EXTS = new Set(['.tsx', '.ts', '.css', '.json'])

function addFolderToZip(zip: JSZip, folderAbs: string, prefix: string): void {
  let entries: string[]
  try {
    entries = readdirSync(folderAbs)
  } catch {
    return
  }

  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry)) continue
    if (EXCLUDE_PATTERNS.test(entry)) continue

    const fullPath = path.join(folderAbs, entry)
    let stat: ReturnType<typeof statSync>
    try {
      stat = statSync(fullPath)
    } catch {
      continue
    }

    if (stat.isDirectory()) {
      addFolderToZip(zip, fullPath, `${prefix}${entry}/`)
    } else {
      const ext = path.extname(entry)
      if (!INCLUDE_EXTS.has(ext)) continue
      try {
        const content = readFileSync(fullPath)
        zip.file(`${prefix}${entry}`, content)
      } catch {
        // skip files we can't read
      }
    }
  }
}

export async function buildZipStream(
  components: ComponentEntry[],
  options?: ComposeOptions,
): Promise<Uint8Array> {
  const zip = new JSZip()
  const libraryRoot = path.resolve(process.cwd(), '..', 'library')

  // Bundle each component folder
  for (const c of components) {
    const folderAbs = path.join(libraryRoot, c.source, c.name)
    const prefix = `library/${c.source}/${c.name}/`

    // First add a readme if it exists in the manifest
    try {
      const readmeAbs = path.join(libraryRoot, c.source, c.name, 'README.md')
      const raw = readFileSync(readmeAbs, 'utf-8')
      zip.file(`${prefix}README.md`, raw)
    } catch {
      // no readme — skip
    }

    addFolderToZip(zip, folderAbs, prefix)
  }

  // Generate top-level README.md for the kit
  const readmeContent = [
    `# SISO Design System Kit`,
    ``,
    `This kit contains ${components.length} component${components.length === 1 ? '' : 's'}.`,
    ``,
    ...components.map((c, i) => [
      `## ${i + 1}. ${c.displayName}`,
      ``,
      c.aiSummary ?? c.description,
      ``,
      `- Source: \`library/${c.source}/${c.name}/\``,
      `- Category: ${join(c.category)}`,
      `- Style: ${join(c.visualStyle)}`,
      `- Complexity: ${join(c.complexity)}`,
      ``,
    ].join('\n')),
    `---`,
    `Generated by SISO Design System · https://siso-design-system.vercel.app`,
  ].join('\n')

  zip.file('README.md', readmeContent)

  return zip.generateAsync({ type: 'uint8array' }) as Promise<Uint8Array>
}

// ------------------------------------------------------------------------------------------------
// Share URL
// ------------------------------------------------------------------------------------------------

const MAX_SHARE_COMPONENTS = 50

export function buildShareUrl(components: ComposeComponent[]): string {
  if (components.length > MAX_SHARE_COMPONENTS) {
    throw new Error(`Share URL capped at ${MAX_SHARE_COMPONENTS} components (got ${components.length})`)
  }
  const payload = JSON.stringify({ components, v: 1 })
  const encoded = btoa(unescape(encodeURIComponent(payload)))
  return `/compose?kit=${encoded}`
}
