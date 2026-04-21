import fs from 'fs/promises'
import path from 'path'

export async function readComponentFile(folderPath: string, filename: string): Promise<string | null> {
  try {
    if (filename.includes('..') || path.isAbsolute(filename)) return null
    const fullPath = path.join(folderPath, filename)
    if (!fullPath.startsWith(folderPath)) return null
    return await fs.readFile(fullPath, 'utf-8')
  } catch {
    return null
  }
}

export async function readAllComponentFiles(folderPath: string, files: string[]): Promise<{ name: string; content: string; language: string }[]> {
  const result = []
  for (const name of files) {
    const content = await readComponentFile(folderPath, name)
    if (content !== null) {
      const ext = name.split('.').pop() || 'txt'
      const language = ext2lang(ext)
      result.push({ name, content, language })
    }
  }
  return result
}

function ext2lang(ext: string): string {
  const map: Record<string, string> = {
    tsx: 'tsx', ts: 'ts', jsx: 'jsx', js: 'js',
    css: 'css', scss: 'scss', json: 'json',
    md: 'md', mdx: 'md', sh: 'sh', yaml: 'yaml', yml: 'yaml',
    html: 'html', svg: 'html', txt: 'txt',
  }
  return map[ext] ?? 'txt'
}
