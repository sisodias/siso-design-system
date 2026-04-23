import { NextRequest, NextResponse } from 'next/server'
import { parseFilters } from '@/lib/filters'
import { getFilteredComponents } from '@/lib/registry'
import type { FilterState } from '@/lib/registry'

export const dynamic = 'force-dynamic'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  // Build Record<string, string | string[] | undefined> — use getAll() for keys
  // with multiple values (?style=a&style=b) so repeatable facet filters work.
  const rawParams: Record<string, string | string[] | undefined> = {}
  for (const key of new Set(searchParams.keys())) {
    const all = searchParams.getAll(key)
    rawParams[key] = all.length > 1 ? all : all[0]
  }

  const filters: FilterState = parseFilters(rawParams)
  const { items, total, facets } = getFilteredComponents(filters)

  return NextResponse.json(
    {
      items,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
      facets,
    },
    { headers: CORS_HEADERS },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
