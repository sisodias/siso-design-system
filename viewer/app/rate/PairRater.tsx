'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { BarChart2, Zap } from 'lucide-react'

interface RateCard {
  source: string
  slug: string
  displayName: string
  category?: string[]
  thumbnail: string | null
  hasThumbnail: boolean
  aiSummary?: string
}

interface Props {
  initialPair: [RateCard, RateCard] | null
  filters: Record<string, string | string[]>
}

function ComponentCard({
  card,
  onPick,
  disabled,
}: {
  card: RateCard
  onPick: () => void
  disabled: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const thumbnailSrc = card.thumbnail ?? `/thumbnails/${card.source}__${card.slug}.png`
  const hasThumbnail = card.hasThumbnail || Boolean(card.thumbnail)

  return (
    <button
      onClick={onPick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex flex-col rounded-2xl border bg-neutral-900 overflow-hidden transition-all duration-200 cursor-pointer w-full
        ${hovered && !disabled
          ? 'border-orange-500/60 shadow-[0_0_32px_rgba(249,115,22,0.18)] scale-[1.015]'
          : 'border-neutral-800'
        }
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
        {hasThumbnail ? (
          <img
            src={thumbnailSrc}
            alt={card.displayName}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-600 text-sm">
            No preview
          </div>
        )}
        {/* Hover overlay */}
        {hovered && !disabled && (
          <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center">
            <div className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
              Pick this
            </div>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-4">
        <div className="text-base font-semibold text-neutral-100 truncate">{card.displayName}</div>
        {card.category && card.category.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {card.category.slice(0, 3).map(cat => (
              <span
                key={cat}
                className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-400"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        {card.aiSummary && (
          <div className="mt-2 text-xs text-neutral-500 line-clamp-2">{card.aiSummary}</div>
        )}
      </div>
    </button>
  )
}

export default function PairRater({ initialPair, filters }: Props) {
  const [pair, setPair] = useState<[RateCard, RateCard] | null>(initialPair)
  const [loading, setLoading] = useState(false)
  const [comparisons, setComparisons] = useState(0)

  const pick = useCallback(
    async (winner: 'a' | 'b') => {
      if (!pair || loading) return
      setLoading(true)

      try {
        const res = await fetch('/api/rate/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            winner,
            a: { source: pair[0].source, slug: pair[0].slug },
            b: { source: pair[1].source, slug: pair[1].slug },
            filters,
          }),
        })
        const data = await res.json()
        setComparisons(c => c + 1)
        if (data.nextPair) {
          setPair([data.nextPair[0], data.nextPair[1]])
        } else {
          setPair(null)
        }
      } catch {
        // best-effort
      } finally {
        setLoading(false)
      }
    },
    [pair, loading, filters],
  )

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Pick your favourite</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Click the component you prefer. Ratings are Elo-based.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">
            {comparisons > 0 && `${comparisons} rated this session`}
          </span>
          <Link
            href="/rate/swipe"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors"
          >
            <Zap className="h-3.5 w-3.5" />
            Swipe mode
          </Link>
          <Link
            href="/rate/leaderboard"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Pair */}
      {pair ? (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <ComponentCard card={pair[0]} onPick={() => pick('a')} disabled={loading} />
          </div>

          {/* VS dot */}
          <div className="flex-none">
            <div className="h-9 w-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-500">
              vs
            </div>
          </div>

          <div className="flex-1 w-full">
            <ComponentCard card={pair[1]} onPick={() => pick('b')} disabled={loading} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <div className="text-xl font-semibold text-neutral-200">All done!</div>
          <div className="text-sm text-neutral-500 mt-2">No more components in this pool.</div>
          <Link
            href="/rate/leaderboard"
            className="mt-6 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
          >
            View leaderboard
          </Link>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
