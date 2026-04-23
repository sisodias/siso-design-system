import { NextRequest, NextResponse } from 'next/server'
import { recordComparison, getRandomPairFromFiltered } from '@/lib/ratings'
import { getAllComponents, getFilteredComponents } from '@/lib/registry'
import { parseFilters } from '@/lib/filters'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { winner, a, b, filters } = body as {
      winner: 'a' | 'b'
      a: { source: string; slug: string }
      b: { source: string; slug: string }
      filters?: Record<string, string | string[]>
    }

    if (!winner || !a || !b) {
      return NextResponse.json({ error: 'Missing required fields: winner, a, b' }, { status: 400 })
    }

    const winnerComp = winner === 'a' ? a : b
    const result = recordComparison(a, b, winnerComp.source, winnerComp.slug)

    // Get next pair
    let pool = filters
      ? getFilteredComponents({ ...parseFilters(filters as Record<string, string | string[] | undefined>), importMode: 'all', pageSize: 9999, page: 1 }).items
      : getAllComponents()

    const nextPair = getRandomPairFromFiltered(pool)

    return NextResponse.json({
      success: true,
      elos: result,
      nextPair: nextPair
        ? [
            { source: nextPair[0].source, slug: nextPair[0].name, displayName: nextPair[0].displayName, category: nextPair[0].category, thumbnail: nextPair[0].thumbnail, hasThumbnail: nextPair[0].hasThumbnail, aiSummary: nextPair[0].aiSummary },
            { source: nextPair[1].source, slug: nextPair[1].name, displayName: nextPair[1].displayName, category: nextPair[1].category, thumbnail: nextPair[1].thumbnail, hasThumbnail: nextPair[1].hasThumbnail, aiSummary: nextPair[1].aiSummary },
          ]
        : null,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('unavailable on Cloudflare Workers')) {
      return NextResponse.json({ error: 'Rating system unavailable in cloud deployment (local-only feature)' }, { status: 503 })
    }
    console.error('rate/compare error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
