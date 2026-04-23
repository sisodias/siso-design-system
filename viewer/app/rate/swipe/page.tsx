import { getAllComponents, getFilteredComponents } from '@/lib/registry'
import { parseFilters } from '@/lib/filters'
import SwipeRater from './SwipeRater'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function SwipePage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams

  const hasFilters = raw.category || raw.style || raw.industry
  const pool = hasFilters
    ? getFilteredComponents({ ...parseFilters(raw), importMode: 'all', pageSize: 9999, page: 1 }).items
    : getAllComponents()

  const renderable = pool.filter(c => c.preview?.renderable !== false)

  const initial = renderable.length > 0
    ? renderable[Math.floor(Math.random() * renderable.length)]
    : null

  const serialCard = initial
    ? {
        source: initial.source,
        slug: initial.name,
        displayName: initial.displayName,
        category: initial.category,
        thumbnail: initial.thumbnail ?? null,
        hasThumbnail: initial.hasThumbnail ?? false,
        aiSummary: initial.aiSummary ?? '',
      }
    : null

  return (
    <div className="pl-64 min-h-screen bg-neutral-950">
      <SwipeRater initialCard={serialCard} filters={raw as Record<string, string | string[]>} />
    </div>
  )
}
