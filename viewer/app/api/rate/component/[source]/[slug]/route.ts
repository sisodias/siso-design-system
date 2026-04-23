import { NextRequest, NextResponse } from 'next/server'
import { getEffectiveElo, getConfidence, getElo, getDb } from '@/lib/ratings'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ source: string; slug: string }> },
) {
  try {
    const { source, slug } = await params

    const elo = getElo(source, slug)
    const effective_elo = getEffectiveElo(source, slug)
    const confidence_tier = getConfidence(source, slug)

    const db = getDb()
    const row = db.prepare('SELECT votes, last_rated, rating_deviation FROM components WHERE source = ? AND slug = ?').get(source, slug) as {
      votes: number; last_rated: string | null; rating_deviation: number
    } | undefined

    if (!row) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }

    return NextResponse.json({
      elo,
      effective_elo,
      votes: row.votes,
      last_rated: row.last_rated,
      confidence_tier,
      rating_deviation: row.rating_deviation,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('unavailable on Cloudflare Workers')) {
      return NextResponse.json({ error: 'Rating system unavailable in cloud deployment (local-only feature)' }, { status: 503 })
    }
    console.error('rate/component error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
