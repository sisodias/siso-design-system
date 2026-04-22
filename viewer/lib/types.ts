export type SourceApp = 'lumelle' | 'restaurant-app-solo' | '21st-dev'
export type PlatformScope = 'Mobile' | 'Desktop' | 'Mixed'

export interface ComponentEntry {
  source: SourceApp
  name: string
  displayName: string
  description: string
  readmePath: string
  folderPath: string
  relativePath: string
  platform: PlatformScope
  tags: string[]
  files: string[]
  addedAt?: string  // ISO timestamp from registry-item.json._provenance.fetchedAt, or file mtime fallback
  preview?: {
    width?: number
    height?: number
    background?: string
    interactive?: boolean
    renderable?: boolean
    reason?: string
  }
}

export interface ReadmeData {
  heading: string
  description: string
  tags: string[]
}
