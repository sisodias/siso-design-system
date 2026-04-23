import { getFilteredComponents, getAllComponents, getManifest } from '@/lib/registry'
import { rank, Brief } from '@/lib/ranker'
import ComponentGrid from '@/components/ComponentGrid'
import { parseFilters } from '@/lib/filters'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function normalizeTag(val: string | string[] | undefined): string[] {
  if (!val) return []
  if (Array.isArray(val)) return val.filter((v): v is string => typeof v === 'string' && v.length > 0)
  if (typeof val === 'string' && val.length > 0) return [val]
  return []
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const raw = await searchParams
  const semantic = raw.semantic === '1' || raw.semantic === 'true'
  const queryParam = typeof raw.query === 'string' ? raw.query : null

  // Semantic search path — use rank() with all facets
  if (semantic && queryParam) {
    const brief: Brief = {
      query: queryParam,
      limit: 120,
      categories: normalizeTag(raw.category),
      visualStyles: normalizeTag(raw.style),
      industries: normalizeTag(raw.industry),
      complexity: (normalizeTag(raw.complexity) as ('atomic' | 'composite' | 'system')[]),
    }
    const manifest = getManifest()
    const allComponents = getAllComponents()
    const results = rank(allComponents, manifest, brief)
    const components = results.map(r => r.component)
    return (
      <div className="pl-64 min-h-screen">
        <ComponentGrid components={components} />
      </div>
    )
  }

  // Default path — use getFilteredComponents
  const filters = parseFilters(raw)
  const { items: components } = getFilteredComponents(filters)

  return (
    <div className="pl-64 min-h-screen">
      <ComponentGrid components={components} />
    </div>
  )
}
