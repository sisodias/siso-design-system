import fs from 'fs/promises'
import { ReadmeData } from './types'

export async function parseReadme(readmePath: string): Promise<ReadmeData | null> {
  try {
    const content = await fs.readFile(readmePath, 'utf-8')
    return parseReadmeContent(content)
  } catch {
    return null
  }
}

export async function getReadmeContent(readmePath: string): Promise<string | null> {
  try {
    return await fs.readFile(readmePath, 'utf-8')
  } catch {
    return null
  }
}

function parseReadmeContent(content: string): ReadmeData {
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
      const tag = trimmed.replace(/\*\*/g, '')
      if (!tags.includes(tag)) tags.push(tag)
    }
  }

  return { heading, description, tags }
}
