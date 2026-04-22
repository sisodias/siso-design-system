import { getFilteredComponents } from '@/lib/registry'
import ComponentGrid from '@/components/ComponentGrid'
import { parseFilters } from '@/lib/filters'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const raw = await searchParams
  const filters = parseFilters(raw)
  const { items: components } = getFilteredComponents(filters)

  return (
    <div className="pl-64 min-h-screen">
      <ComponentGrid components={components} />
    </div>
  )
}
