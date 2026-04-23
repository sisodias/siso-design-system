import { getAllComponents, getFilteredComponents } from '@/lib/registry'
import { parseFilters } from '@/lib/filters'
import { getRandomPairFromFiltered } from '@/lib/ratings'
import PairRater from './PairRater'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function RatePage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams

  // Build pool — respect filters but always use all importModes
  const hasFilters = raw.category || raw.style || raw.industry
  const pool = hasFilters
    ? getFilteredComponents({ ...parseFilters(raw), importMode: 'all', pageSize: 9999, page: 1 }).items
    : getAllComponents()

  const pair = getRandomPairFromFiltered(pool)

  const serialPair = pair
    ? [
        {
          source: pair[0].source,
          slug: pair[0].name,
          displayName: pair[0].displayName,
          category: pair[0].category,
          thumbnail: pair[0].thumbnail ?? null,
          hasThumbnail: pair[0].hasThumbnail ?? false,
          aiSummary: pair[0].aiSummary ?? '',
        },
        {
          source: pair[1].source,
          slug: pair[1].name,
          displayName: pair[1].displayName,
          category: pair[1].category,
          thumbnail: pair[1].thumbnail ?? null,
          hasThumbnail: pair[1].hasThumbnail ?? false,
          aiSummary: pair[1].aiSummary ?? '',
        },
      ]
    : null

  const filters = raw

  return (
    <div className="pl-64 min-h-screen bg-neutral-950">
      <PairRater initialPair={serialPair} filters={filters as Record<string, string | string[]>} />
    </div>
  )
}
