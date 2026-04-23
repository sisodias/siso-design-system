import { NextRequest, NextResponse } from 'next/server'
import { recordSwipe, getRandomPairFromFiltered } from '@/lib/ratings'
import { getAllComponents, getFilteredComponents } from '@/lib/registry'
import { parseFilters } from '@/lib/filters'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { source, slug, action, filters } = body as {
      source: string
      slug: string
      action: 'skip' | 'keep' | 'love'
      filters?: Record<string, string | string[]>
    }

    if (!source || !slug || !action) {
      return NextResponse.json({ error: 'Missing required fields: source, slug, action' }, { status: 400 })
    }

    if (!['skip', 'keep', 'love'].includes(action)) {
      return NextResponse.json({ error: 'action must be skip, keep, or love' }, { status: 400 })
    }

    recordSwipe(source, slug, action)

    // Get next component
    let pool = filters
      ? getFilteredComponents({ ...parseFilters(filters as Record<string, string | string[] | undefined>), importMode: 'all', pageSize: 9999, page: 1 }).items
      : getAllComponents()

    // Pick a single random component from the pool (exclude the one just swiped)
    const candidates = pool.filter(
      c => !(c.source === source && c.name === slug) && c.preview?.renderable !== false,
    )

    const next = candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : null

    return NextResponse.json({
      success: true,
      next: next
        ? {
            source: next.source,
            slug: next.name,
            displayName: next.displayName,
            category: next.category,
            thumbnail: next.thumbnail,
            hasThumbnail: next.hasThumbnail,
            aiSummary: next.aiSummary,
          }
        : null,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('unavailable on Cloudflare Workers')) {
      return NextResponse.json({ error: 'Rating system unavailable in cloud deployment (local-only feature)' }, { status: 503 })
    }
    console.error('rate/swipe error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
