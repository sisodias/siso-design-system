import { NextResponse } from 'next/server'
import { getStats, getLeaderboard } from '@/lib/ratings'
import { getComponent } from '@/lib/registry'

export const dynamic = 'force-dynamic'

export function GET() {
  try {
    const stats = getStats()
    const top10Raw = getLeaderboard(10)

    // Enrich leaderboard with component metadata
    const leaderboardTop10 = top10Raw.map(row => {
      const comp = getComponent(row.source, row.slug)
      return {
        source: row.source,
        slug: row.slug,
        elo: row.elo,
        votes: row.votes,
        displayName: comp?.displayName ?? row.slug,
        category: comp?.category ?? [],
        thumbnail: comp?.thumbnail ?? null,
        hasThumbnail: comp?.hasThumbnail ?? false,
      }
    })

    return NextResponse.json({
      totalComparisons: stats.totalComparisons,
      totalSwipes: stats.totalSwipes,
      totalRated: stats.totalRated,
      promotedCount: stats.promotedCount,
      leaderboardTop10,
    })
  } catch (err) {
    console.error('rate/stats error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
