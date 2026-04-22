export type SourceApp = '21st-dev' | string
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
  /** Populated by W3 thumbnail generation; null if no thumbnail yet. */
  thumbnail?: string | null
  /** Convenience flag — true when thumbnail is non-null. */
  hasThumbnail?: boolean
}

export interface ReadmeData {
  heading: string
  description: string
  tags: string[]
}

// --- Manifest types (W1) ---

export type ManifestFacet = { value: string; count: number }

export type ManifestEntry = {
  source: string
  name: string
  displayName: string
  description: string
  platform: 'Mobile' | 'Desktop' | 'Mixed'
  tags: string[]
  files: string[]
  addedAt?: string
  relativePath: string
  folderPath: string
  readmePath: string
  preview?: {
    width?: number
    height?: number
    background?: string
    interactive?: boolean
    renderable?: boolean
    reason?: string
  }
  thumbnail?: string | null
  hasThumbnail: boolean
}

export type Manifest = {
  generatedAt: string
  schemaVersion: 1
  total: number
  components: ManifestEntry[]
  facets: {
    sources: ManifestFacet[]
    tags: ManifestFacet[]
    platforms: ManifestFacet[]
  }
}
