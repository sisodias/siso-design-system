/**
 * viewer/lib/filters.ts
 *
 * Pure filter/pagination utilities consumed by page.tsx.
 * FilterState must structurally match the Partial<{...}> type declared in registry.ts
 * so that the getFilteredComponents call compiles without import cycles.
 */

import { ComponentEntry, ManifestFacet } from './types'

// ------------------------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------------------------

export type FilterState = {
  source: string | null
  tags: string[]
  platform: string | null
  search: string
  page: number
  pageSize: number
}

// ------------------------------------------------------------------------------------------------
// Parse URL search params into FilterState
// ------------------------------------------------------------------------------------------------

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 120
const VALID_PLATFORMS = new Set(['Mobile', 'Desktop', 'Mixed'])

function normalizeTag(val: string | string[] | undefined): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string' && v.length > 0)
  if (typeof val === 'string' && val.length > 0) return [val]
  return []
}

function normalizeString(val: string | string[] | undefined): string | null {
  if (!val) return null
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0] : null
  if (typeof val === 'string') return val
  return null
}

export function parseFilters(
  raw: Record<string, string | string[] | undefined>,
): FilterState {
  const source = normalizeString(raw.source)
  const tags = normalizeTag(raw.tag)
  const search = normalizeString(raw.q) ?? ''
  const platformRaw = normalizeString(raw.platform)
  const platform =
    platformRaw && VALID_PLATFORMS.has(platformRaw) ? platformRaw : null

  let page = DEFAULT_PAGE
  if (raw.page !== undefined) {
    const n = parseInt(Array.isArray(raw.page) ? raw.page[0] : raw.page, 10)
    page = isNaN(n) || n < 1 ? DEFAULT_PAGE : n
  }

  let pageSize = DEFAULT_PAGE_SIZE
  if (raw.pageSize !== undefined) {
    const n = parseInt(
      Array.isArray(raw.pageSize) ? raw.pageSize[0] : raw.pageSize,
      10,
    )
    pageSize = isNaN(n) || n < 1 ? DEFAULT_PAGE_SIZE : n
  }

  return { source, tags, platform, search, page, pageSize }
}

// ------------------------------------------------------------------------------------------------
// Pure client-side filter (mirrors getFilteredComponents logic for local use)
// ------------------------------------------------------------------------------------------------

export function filterComponents(all: ComponentEntry[], filters: FilterState) {
  let result = [...all]

  if (filters.source) {
    result = result.filter(c => c.source === filters.source)
  }

  if (filters.platform) {
    result = result.filter(c => c.platform === filters.platform)
  }

  if (filters.tags.length > 0) {
    result = result.filter(c => filters.tags.every(t => c.tags.includes(t)))
  }

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    result = result.filter(
      c =>
        c.displayName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)),
    )
  }

  return result
}

// ------------------------------------------------------------------------------------------------
// Build facet aggregates from an unfiltered component list (for sidebar counts)
// ------------------------------------------------------------------------------------------------

export function buildFacets(all: ComponentEntry[]): {
  sources: ManifestFacet[]
  tags: ManifestFacet[]
  platforms: ManifestFacet[]
} {
  const sourceCounts: Record<string, number> = {}
  const tagCounts: Record<string, number> = {}
  const platformCounts: Record<string, number> = {}

  for (const c of all) {
    sourceCounts[c.source] = (sourceCounts[c.source] ?? 0) + 1
    tagCounts[c.platform] = (tagCounts[c.platform] ?? 0) + 1
    for (const t of c.tags) {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1
    }
  }

  const sortDesc = (a: ManifestFacet, b: ManifestFacet) => b.count - a.count

  return {
    sources: Object.entries(sourceCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(sortDesc),
    tags: Object.entries(tagCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(sortDesc),
    platforms: Object.entries(platformCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(sortDesc),
  }
}
