import fs from 'fs/promises'
import path from 'path'
import { ComponentEntry, SourceApp, PlatformScope, ReadmeData } from './types'

const BASE_DIR = process.cwd()

export async function getAllComponents(): Promise<ComponentEntry[]> {
  const components: ComponentEntry[] = []

  const sources: { name: SourceApp; dir: string; platform: PlatformScope }[] = [
    { name: 'lumelle', dir: '../_raw/lumelle', platform: 'Mobile' },
    { name: 'restaurant-app-solo', dir: '../_raw/restaurant-app-solo', platform: 'Mobile' },
    { name: '21st.dev', dir: '../_external/21st-dev', platform: 'Mixed' },
  ]

  for (const source of sources) {
    try {
      const sourcePath = path.resolve(BASE_DIR, source.dir)
      const entries = await fs.readdir(sourcePath, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const folderPath = path.join(sourcePath, entry.name)
          const readmePath = path.join(folderPath, 'README.md')
          const relativePath = `${source.dir}/${entry.name}/`

          let description = ''
          let tags: string[] = []

          try {
            const content = await fs.readFile(readmePath, 'utf-8')
            const parsed = parseReadmeContent(content)
            description = parsed.description
            tags = parsed.tags
          } catch {
            // No README, use folder name as description
            description = entry.name.replace(/-/g, ' ')
          }

          let files: string[] = []
          try {
            const folderEntries = await fs.readdir(folderPath)
            files = folderEntries.filter(f =>
              f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')
            )
          } catch {
            // Ignore
          }

          components.push({
            source: source.name,
            name: entry.name,
            displayName: prettifyName(entry.name),
            description: truncate(description, 120),
            readmePath,
            folderPath,
            relativePath,
            platform: source.platform,
            tags,
            files,
          })
        }
      }
    } catch {
      // Source directory doesn't exist, skip
    }
  }

  return components
}

export async function getComponent(source: string, name: string): Promise<ComponentEntry | null> {
  const components = await getAllComponents()
  return components.find(c => c.source === source && c.name === name) || null
}

export async function getComponentFiles(folderPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(folderPath)
    return entries.filter(f =>
      f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')
    ).sort()
  } catch {
    return []
  }
}

function prettifyName(name: string): string {
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

interface ParsedReadme {
  heading: string
  description: string
  tags: string[]
}

function parseReadmeContent(content: string): ParsedReadme {
  const lines = content.split('\n')
  let heading = ''
  let description = ''
  const tags: string[] = []

  let foundDescription = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (!heading && trimmed.startsWith('#')) {
      heading = trimmed.replace(/^#+\s*/, '').trim()
      continue
    }

    if (!foundDescription && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      description = trimmed
      foundDescription = true
      continue
    }

    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      tags.push(trimmed.replace(/\*\*/g, ''))
    }
  }

  return { heading, description, tags }
}
