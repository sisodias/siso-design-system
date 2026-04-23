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
  importMode: 'curated' | 'all' | 'generic'
  categories: string[]
  visualStyles: string[]
  industries: string[]
  complexity: ('atomic' | 'composite' | 'system')[]
}

// ------------------------------------------------------------------------------------------------
// Parse URL search params into FilterState
// ------------------------------------------------------------------------------------------------

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 120
const VALID_PLATFORMS = new Set(['Mobile', 'Desktop', 'Mixed'])
const VALID_MODES = new Set(['curated', 'all', 'generic'])

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

  const modeRaw = normalizeString(raw.mode)
  const importMode = (modeRaw && VALID_MODES.has(modeRaw) ? modeRaw : 'curated') as FilterState['importMode']

  // AI classification filters (array, repeatable URL params)
  const categories = normalizeTag(raw.category)
  const visualStyles = normalizeTag(raw.style)
  const industries = normalizeTag(raw.industry)
  const complexityRaw = normalizeTag(raw.complexity)
  const complexity = complexityRaw.filter(v =>
    v === 'atomic' || v === 'composite' || v === 'system',
  ) as FilterState['complexity']

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

  return { source, tags, platform, search, page, pageSize, importMode, categories, visualStyles, industries, complexity }
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
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        (c.aiSummary ? c.aiSummary.toLowerCase().includes(q) : false) ||
        (Array.isArray(c.useCases) && c.useCases.some((u: string) => u.toLowerCase().includes(q))),
    )
  }

  // AI classification filters (OR match)
  if (filters.categories.length > 0) {
    result = result.filter(c => {
      if (!c.category || c.category.length === 0) return false
      const cats = (Array.isArray(c.category) ? c.category : [c.category]).map(v => v.toLowerCase())
      return filters.categories.some(f => cats.includes(f.toLowerCase()))
    })
  }

  if (filters.visualStyles.length > 0) {
    result = result.filter(c => {
      if (!c.visualStyle || c.visualStyle.length === 0) return false
      return filters.visualStyles.some(f => c.visualStyle!.map(v => v.toLowerCase()).includes(f.toLowerCase()))
    })
  }

  if (filters.industries.length > 0) {
    result = result.filter(c => {
      if (!c.bestForIndustries || c.bestForIndustries.length === 0) return false
      return filters.industries.some(f => c.bestForIndustries!.map(v => v.toLowerCase()).includes(f.toLowerCase()))
    })
  }

  if (filters.complexity.length > 0) {
    result = result.filter(c => {
      if (!c.complexity) return false
      const comp = Array.isArray(c.complexity) ? c.complexity : [c.complexity]
      return filters.complexity.some(f => comp.includes(f))
    })
  }

  if (filters.importMode === 'curated') {
    result = result.filter(c => c.importMode !== 'bulk')
  } else if (filters.importMode === 'generic') {
    result = result.filter(c => c.importMode === 'bulk')
  }
  // importMode === 'all' → no filter

  return result
}

// ------------------------------------------------------------------------------------------------
// Build facet aggregates from an unfiltered component list (for sidebar counts)
// ------------------------------------------------------------------------------------------------

export function buildFacets(all: ComponentEntry[]): {
  sources: ManifestFacet[]
  tags: ManifestFacet[]
  platforms: ManifestFacet[]
  categories: ManifestFacet[]
  visualStyles: ManifestFacet[]
  industries: ManifestFacet[]
  complexity: ManifestFacet[]
} {
  const sourceCounts: Record<string, number> = {}
  const tagCounts: Record<string, number> = {}
  const platformCounts: Record<string, number> = {}
  const categoryCounts: Record<string, number> = {}
  const visualStyleCounts: Record<string, number> = {}
  const industryCounts: Record<string, number> = {}
  const complexityCounts: Record<string, number> = {}

  for (const c of all) {
    sourceCounts[c.source] = (sourceCounts[c.source] ?? 0) + 1
    platformCounts[c.platform] = (platformCounts[c.platform] ?? 0) + 1
    for (const t of c.tags) {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1
    }
    if (c.category) {
      const cats = Array.isArray(c.category) ? c.category : [c.category]
      for (const cat of cats) {
        categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1
      }
    }
    if (c.visualStyle) {
      for (const style of c.visualStyle) {
        visualStyleCounts[style] = (visualStyleCounts[style] ?? 0) + 1
      }
    }
    if (c.bestForIndustries) {
      for (const ind of c.bestForIndustries) {
        industryCounts[ind] = (industryCounts[ind] ?? 0) + 1
      }
    }
    if (c.complexity) {
      const comps = Array.isArray(c.complexity) ? c.complexity : [c.complexity]
      for (const comp of comps) {
        complexityCounts[comp] = (complexityCounts[comp] ?? 0) + 1
      }
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
    categories: Object.entries(categoryCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(sortDesc),
    visualStyles: Object.entries(visualStyleCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(sortDesc),
    industries: Object.entries(industryCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(sortDesc),
    complexity: Object.entries(complexityCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(sortDesc),
  }
}
