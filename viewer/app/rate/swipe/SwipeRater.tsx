'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Check, Heart, BarChart2, Layers } from 'lucide-react'

interface SwipeCard {
  source: string
  slug: string
  displayName: string
  category?: string[]
  thumbnail: string | null
  hasThumbnail: boolean
  aiSummary?: string
}

type SwipeAction = 'skip' | 'keep' | 'love'

interface Props {
  initialCard: SwipeCard | null
  filters: Record<string, string | string[]>
}

function ActionButton({
  action,
  onClick,
  disabled,
}: {
  action: SwipeAction
  onClick: () => void
  disabled: boolean
}) {
  const configs: Record<
    SwipeAction,
    { icon: React.ReactNode; label: string; colorClass: string; bgClass: string }
  > = {
    skip: {
      icon: <X className="h-5 w-5" />,
      label: 'Skip',
      colorClass: 'text-neutral-400',
      bgClass: 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700',
    },
    keep: {
      icon: <Check className="h-5 w-5" />,
      label: 'Keep',
      colorClass: 'text-green-400',
      bgClass: 'bg-green-950/50 hover:bg-green-900/50 border-green-800/50',
    },
    love: {
      icon: <Heart className="h-5 w-5" />,
      label: 'Love',
      colorClass: 'text-pink-400',
      bgClass: 'bg-pink-950/50 hover:bg-pink-900/50 border-pink-800/50',
    },
  }
  const { icon, label, colorClass, bgClass } = configs[action]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1.5 rounded-xl border px-6 py-3 transition-colors ${bgClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={colorClass}>{icon}</span>
      <span className={`text-xs font-medium ${colorClass}`}>{label}</span>
    </button>
  )
}

export default function SwipeRater({ initialCard, filters }: Props) {
  const [card, setCard] = useState<SwipeCard | null>(initialCard)
  const [loading, setLoading] = useState(false)
  const [swipes, setSwipes] = useState(0)
  const [lastAction, setLastAction] = useState<SwipeAction | null>(null)
  const [animating, setAnimating] = useState(false)

  const swipe = useCallback(
    async (action: SwipeAction) => {
      if (!card || loading || animating) return

      setLastAction(action)
      setAnimating(true)
      setLoading(true)

      try {
        const res = await fetch('/api/rate/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: card.source,
            slug: card.slug,
            action,
            filters,
          }),
        })
        const data = await res.json()
        setSwipes(s => s + 1)

        // Brief animation delay before showing next card
        await new Promise(r => setTimeout(r, 250))

        if (data.next) {
          setCard(data.next)
        } else {
          setCard(null)
        }
      } catch {
        // best-effort
      } finally {
        setLoading(false)
        setAnimating(false)
      }
    },
    [card, loading, animating, filters],
  )

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (loading || animating) return
      if (e.key === 'ArrowLeft') swipe('skip')
      else if (e.key === 'ArrowRight') swipe('keep')
      else if (e.key === 'ArrowUp') swipe('love')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [swipe, loading, animating])

  const thumbnailSrc = card
    ? card.thumbnail ?? `/thumbnails/${card.source}__${card.slug}.png`
    : ''
  const hasThumbnail = card ? card.hasThumbnail || Boolean(card.thumbnail) : false

  const animClass = animating
    ? lastAction === 'skip'
      ? 'translate-x-[-8px] opacity-50'
      : lastAction === 'love'
      ? 'translate-y-[-8px] opacity-50'
      : 'translate-x-[8px] opacity-50'
    : 'translate-x-0 translate-y-0 opacity-100'

  return (
    <div className="flex flex-col items-center px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100">Swipe to rate</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {swipes > 0 ? `${swipes} rated this session` : 'Rate components fast'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/rate"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors"
          >
            <Layers className="h-3 w-3" />
            Pair mode
          </Link>
          <Link
            href="/rate/leaderboard"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors"
          >
            <BarChart2 className="h-3 w-3" />
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Card */}
      {card ? (
        <div className="w-full max-w-lg flex flex-col gap-6">
          <div
            className={`relative rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden transition-all duration-200 ${animClass}`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] w-full bg-neutral-950">
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
            </div>

            {/* Info */}
            <div className="p-5">
              <div className="text-xl font-bold text-neutral-100">{card.displayName}</div>
              {card.category && card.category.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {card.category.slice(0, 4).map(cat => (
                    <span
                      key={cat}
                      className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[11px] font-medium text-neutral-400"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              {card.aiSummary && (
                <p className="mt-3 text-sm text-neutral-400 leading-relaxed line-clamp-3">
                  {card.aiSummary}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4">
            <ActionButton action="skip" onClick={() => swipe('skip')} disabled={loading || animating} />
            <ActionButton action="keep" onClick={() => swipe('keep')} disabled={loading || animating} />
            <ActionButton action="love" onClick={() => swipe('love')} disabled={loading || animating} />
          </div>

          {/* Keyboard hint */}
          <div className="text-center text-[11px] text-neutral-600">
            ← Skip · → Keep · ↑ Love
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <div className="text-5xl mb-4">✨</div>
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
    </div>
  )
}
