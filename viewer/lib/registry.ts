import fs from 'fs/promises'
import path from 'path'
import { ComponentEntry, SourceApp, PlatformScope } from './types'

const LIBRARY_ROOT = path.resolve(process.cwd(), '../library')

interface RegistryItem {
  name: string
  type: string
  title: string
  description: string
  source: string
  platform: 'Mobile' | 'Desktop' | 'Mixed'
  tags: string[]
  files: Array<{ path: string; type: string }>
  dependencies: string[]
  registryDependencies: string[]
  preview?: {
    width?: number
    height?: number
    background?: string
    interactive?: boolean
    renderable?: boolean
    reason?: string
  }
  _provenance?: {
    fetchedFrom?: string
    fetchedAt?: string
  }
}

export async function getAllComponents(): Promise<ComponentEntry[]> {
  const components: ComponentEntry[] = []
  let sources: string[] = []
  try {
    sources = await fs.readdir(LIBRARY_ROOT)
  } catch { return components }

  for (const source of sources) {
    const sourcePath = path.join(LIBRARY_ROOT, source)
    let slugs: string[] = []
    try {
      const entries = await fs.readdir(sourcePath, { withFileTypes: true })
      slugs = entries.filter(e => e.isDirectory()).map(e => e.name)
    } catch { continue }

    for (const slug of slugs) {
      const itemPath = path.join(sourcePath, slug, 'registry-item.json')
      try {
        const raw = await fs.readFile(itemPath, 'utf-8')
        const item: RegistryItem = JSON.parse(raw)
        // Prefer explicit provenance timestamp; fall back to the registry-item.json's mtime
        let addedAt = item._provenance?.fetchedAt
        if (!addedAt) {
          try {
            const stat = await fs.stat(itemPath)
            addedAt = stat.mtime.toISOString()
          } catch {}
        }
        components.push({
          source: source as SourceApp,
          name: slug,
          displayName: item.title || prettifyName(slug),
          description: item.description || '',
          readmePath: path.join(sourcePath, slug, 'README.md'),
          folderPath: path.join(sourcePath, slug),
          relativePath: `library/${source}/${slug}/`,
          platform: (item.platform as PlatformScope) || 'Mixed',
          tags: item.tags || [],
          files: item.files?.map(f => f.path) || [],
          addedAt,
          preview: item.preview,
        })
      } catch {
        // Skip components without a valid registry-item.json
        continue
      }
    }
  }

  return components.sort((a, b) => `${a.source}/${a.name}`.localeCompare(`${b.source}/${b.name}`))
}

export async function getComponent(source: string, name: string): Promise<ComponentEntry | null> {
  const all = await getAllComponents()
  return all.find(c => c.source === source && c.name === name) || null
}

function prettifyName(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
