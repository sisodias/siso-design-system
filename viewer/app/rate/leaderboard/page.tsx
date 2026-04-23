import { getLeaderboard } from '@/lib/ratings'
import { getComponent } from '@/lib/registry'
import Link from 'next/link'
import { Trophy, Layers, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  const rows = getLeaderboard(50)

  const enriched = rows.map((row, i) => {
    const comp = getComponent(row.source, row.slug)
    const confidence =
      row.votes < 5 ? 'low' : row.votes < 20 ? 'medium' : 'high'
    // Compute days ago for last_rated
    let lastRatedLabel = null
    if (row.last_rated) {
      const diffMs = Date.now() - new Date(row.last_rated).getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      lastRatedLabel = diffDays === 0 ? 'today' : `${diffDays}d ago`
    }
    return {
      rank: i + 1,
      source: row.source,
      slug: row.slug,
      elo: row.elo,
      effective_elo: row.effective_elo,
      votes: row.votes,
      confidence,
      lastRatedLabel,
      rating_deviation: row.rating_deviation,
      displayName: comp?.displayName ?? row.slug,
      category: comp?.category ?? [],
      thumbnail: comp?.thumbnail ?? null,
      hasThumbnail: comp?.hasThumbnail ?? false,
    }
  })

  // Group by primary category
  const byCategory = new Map<string, typeof enriched>()
  for (const item of enriched) {
    const cat = item.category?.[0] ?? 'Uncategorized'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(item)
  }

  function rankColor(rank: number): string {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-neutral-300'
    if (rank === 3) return 'text-amber-600'
    if (rank <= 10) return 'text-orange-400'
    return 'text-neutral-500'
  }

  function effectiveEloColor(elo: number): string {
    if (elo >= 1400) return 'text-yellow-400'
    if (elo >= 1300) return 'text-orange-400'
    if (elo >= 1200) return 'text-neutral-300'
    return 'text-neutral-500'
  }

  function confidenceBadgeColor(confidence: string): string {
    if (confidence === 'high') return 'bg-green-900/60 text-green-300 border border-green-700'
    if (confidence === 'medium') return 'bg-yellow-900/40 text-yellow-300 border border-yellow-700'
    return 'bg-neutral-800 text-neutral-500 border border-neutral-700'
  }

  return (
    <div className="pl-64 min-h-screen bg-neutral-950">
      <div className="px-4 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-neutral-100">Leaderboard</h1>
              <p className="text-sm text-neutral-500 mt-0.5">Top {enriched.length} components by effective Elo rating</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/rate"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              Pair mode
            </Link>
            <Link
              href="/rate/swipe"
              className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              Swipe mode
            </Link>
          </div>
        </div>

        {enriched.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-lg font-semibold text-neutral-300">No ratings yet</div>
            <div className="text-sm text-neutral-500 mt-2">Start rating components to see the leaderboard.</div>
            <Link href="/rate" className="mt-5 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400 transition-colors">
              Start rating
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Flat table view */}
            <div className="rounded-xl border border-neutral-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/60">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 w-12">#</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Component</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-500 hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-500 w-24">Eff. Elo</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-500 w-12">Votes</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">Last rated</th>
                    <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-500 w-16">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {enriched.map((item) => (
                    <tr
                      key={`${item.source}/${item.slug}`}
                      className={`border-b border-neutral-800/50 hover:bg-neutral-900/40 transition-colors ${item.rank <= 10 ? 'bg-yellow-950/10' : ''}`}
                    >
                      <td className={`px-4 py-3 font-bold tabular-nums ${rankColor(item.rank)}`}>
                        {item.rank <= 3 ? (
                          <span>{item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}</span>
                        ) : (
                          item.rank
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/?preview=${encodeURIComponent(item.source)}/${encodeURIComponent(item.slug)}`}
                          className="flex items-center gap-3 group"
                        >
                          {item.hasThumbnail && item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.displayName}
                              className="h-9 w-12 rounded object-cover border border-neutral-700 flex-none"
                            />
                          ) : (
                            <div className="h-9 w-12 rounded border border-neutral-700 bg-neutral-800 flex-none" />
                          )}
                          <span className="font-medium text-neutral-200 group-hover:text-white transition-colors truncate max-w-[200px]">
                            {item.displayName}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {item.category && item.category.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.category.slice(0, 2).map(cat => (
                              <span
                                key={cat}
                                className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-400"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-bold tabular-nums ${effectiveEloColor(item.effective_elo)}`}>
                        {Math.round(item.effective_elo)}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-400 tabular-nums">
                        {item.votes}
                      </td>
                      <td className="px-4 py-3 text-right text-neutral-600 tabular-nums hidden lg:table-cell">
                        {item.lastRatedLabel ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${confidenceBadgeColor(item.confidence)}`}>
                          {item.confidence}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
