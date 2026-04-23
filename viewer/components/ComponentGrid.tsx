'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ComponentEntry } from '@/lib/types'
import Sidebar from './Sidebar'
import Breadcrumb from './Breadcrumb'
import Card from './Card'

interface ComponentGridProps {
  components: ComponentEntry[]
}

const SOURCE_LABELS: Record<string, string> = {
  '21st-dev': '21st.dev',
}

function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source
}

// Card height estimate: aspect 4:3 at typical grid column width + title row (~40px)
// At lg breakpoint (3 cols in ~1200px container): col = ~380px, card height = 380*(3/4) + 40 = ~325px
// Use a conservative 280px as baseline — virtualizer over-renders slightly but that's safe.
const ESTIMATED_ROW_HEIGHT = 280
const VIRTUALISATION_THRESHOLD = 60

/**
 * Determines column count from container width, matching Tailwind responsive classes:
 * - below md (<768px): 1 col
 * - md–lg (768px–1023px): 2 cols
 * - lg+ (>=1024px): 3 cols
 */
function getColumnCount(containerWidth: number): number {
  if (containerWidth >= 1024) return 3
  if (containerWidth >= 768) return 2
  return 1
}

// ------------------------------------------------------------------------------------------------
// Virtualized grid — renders only the rows in or near the viewport.
// ------------------------------------------------------------------------------------------------

interface VirtualGridProps {
  items: ComponentEntry[]
  /** Unique key prefix so React can differentiate "recent" from main list */
  keyPrefix?: string
}

function VirtualGrid({ items, keyPrefix = '' }: VirtualGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  // Observe container width to compute column count
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(containerRef.current)
    // Seed with initial width
    setContainerWidth(containerRef.current.getBoundingClientRect().width)
    return () => observer.disconnect()
  }, [])

  const columnCount = useMemo(
    () => (containerWidth > 0 ? getColumnCount(containerWidth) : 3),
    [containerWidth],
  )

  const rowCount = Math.ceil(items.length / columnCount)

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => {
      // Walk up to find the nearest scrollable ancestor (the page scroll container)
      let el = containerRef.current?.parentElement ?? null
      while (el) {
        const style = getComputedStyle(el)
        const overflow = style.overflow + style.overflowY
        if (/auto|scroll/.test(overflow)) return el
        el = el.parentElement
      }
      return document.documentElement
    },
    estimateSize: () => ESTIMATED_ROW_HEIGHT + 16, // +16 for gap
    overscan: 3,
  })

  const gapClass = 'gap-4'
  const colClass =
    columnCount === 3
      ? 'grid-cols-3'
      : columnCount === 2
        ? 'grid-cols-2'
        : 'grid-cols-1'

  return (
    // Outer container — provides a stable measurement target
    <div ref={containerRef} className="w-full">
      {/* Inner div sized to the total virtual height so the page gets the correct scrollbar */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => {
          const startIndex = virtualRow.index * columnCount
          const rowItems = items.slice(startIndex, startIndex + columnCount)

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: '16px', // gap between rows
              }}
            >
              <div className={`grid ${colClass} ${gapClass}`}>
                {rowItems.map(c => (
                  <Card
                    key={`${keyPrefix}${c.source}-${c.name}`}
                    component={c}
                  />
                ))}
                {/* Fill empty cells in the last row so layout doesn't collapse */}
                {rowItems.length < columnCount &&
                  Array.from({ length: columnCount - rowItems.length }).map((_, i) => (
                    <div key={`pad-${i}`} aria-hidden="true" />
                  ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ------------------------------------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------------------------------------

export default function ComponentGrid({ components }: ComponentGridProps) {
  const searchParams = useSearchParams()
  const isSemantic = searchParams.get('semantic') === '1'
  const queryParam = searchParams.get('query')

  // In semantic mode, initialise search from the ?query= URL param;
  // in normal mode start blank (user types into sidebar search).
  const [search, setSearch] = useState(() => isSemantic && queryParam ? queryParam : '')
  const [activeSource, setActiveSource] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return components.filter(c => {
      if (activeSource === 'recent') return true // handled separately below
      if (activeSource !== null && c.source !== activeSource) return false
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const haystack = [
          c.name, c.displayName, c.description,
          ...c.tags
        ].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [components, search, activeSource])

  // Top 6 most recently added (by addedAt). Used for the "Recently Added" rail
  // shown on the main grid when no filter is active, AND for the "recent" view.
  const recent = useMemo(() => {
    return [...components]
      .filter(c => c.addedAt)
      .sort((a, b) => (b.addedAt! > a.addedAt! ? 1 : -1))
      .slice(0, activeSource === 'recent' ? 24 : 6)
  }, [components, activeSource])

  const showRecentRail = activeSource === null && !search.trim() && recent.length > 0
  const viewingRecent = activeSource === 'recent'

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of components) {
      counts[c.source] = (counts[c.source] ?? 0) + 1
    }
    return Object.entries(counts).map(([source, count]) => ({
      source,
      label: sourceLabel(source),
      count,
    }))
  }, [components])

  // The array to render in the main grid slot
  const mainItems = viewingRecent ? recent : filtered

  // Decide whether to use virtualization for the main grid
  const useVirtualGrid = mainItems.length > VIRTUALISATION_THRESHOLD

  return (
    <>
      <Sidebar
        sourceCounts={sourceCounts}
        activeSource={activeSource ?? undefined}
        onSourceFilter={setActiveSource}
        onSearchChange={setSearch}
        searchValue={search}
      />
      <div className="px-10 pt-6">
        <Breadcrumb
          items={[
            { label: 'Bookmarks', href: '/' },
            { label: viewingRecent ? 'Recently Added' : (activeSource ? sourceLabel(activeSource) : 'Components') },
          ]}
        />
        <h1 className="mt-3 mb-6 text-2xl font-medium">
          {viewingRecent
            ? 'Recently Added'
            : activeSource
              ? sourceLabel(activeSource)
              : 'All components'}
        </h1>
      </div>

      {/* Recently Added rail — only shown on the main grid when nothing is filtered.
          Always renders as a plain grid (max 6 cards) — never virtualized. */}
      {showRecentRail && (
        <div className="px-10 pb-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
              Recently Added
            </h2>
            <button
              onClick={() => setActiveSource('recent')}
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              View all →
            </button>
          </div>
          {/* Plain grid — max 6 cards, no virtualizer */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.map(c => (
              <Card key={`recent-${c.source}-${c.name}`} component={c} />
            ))}
          </div>
          <div className="mb-6 border-b border-neutral-800" />
        </div>
      )}

      <div className="px-10 pb-10">
        {!viewingRecent && (
          <div className="mb-4 flex items-center justify-between text-sm text-neutral-500">
            <span>
              {filtered.length} {filtered.length === 1 ? 'component' : 'components'}
              {showRecentRail && ' (all)'}
            </span>
          </div>
        )}

        {/* Main grid — plain below threshold, virtualized above */}
        {useVirtualGrid ? (
          <VirtualGrid items={mainItems} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mainItems.map(c => (
              <Card key={`${c.source}-${c.name}`} component={c} />
            ))}
          </div>
        )}

        {!viewingRecent && filtered.length === 0 && (
          <div className="mt-20 text-center text-neutral-500">
            No components match your filters.
          </div>
        )}
      </div>
    </>
  )
}
