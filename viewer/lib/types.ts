export type SourceApp = 'lumelle' | 'restaurant-app-solo' | '21st.dev'
export type PlatformScope = 'Mobile' | 'Mixed'

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
}

export interface ReadmeData {
  heading: string
  description: string
  tags: string[]
}
