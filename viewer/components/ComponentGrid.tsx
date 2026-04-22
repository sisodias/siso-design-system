'use client'

import { useState, useMemo } from 'react'
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

export default function ComponentGrid({ components }: ComponentGridProps) {
  const [search, setSearch] = useState('')
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

      {/* Recently Added rail — only shown on the main grid when nothing is filtered */}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(viewingRecent ? recent : filtered).map(c => (
            <Card key={`${c.source}-${c.name}`} component={c} />
          ))}
        </div>
        {!viewingRecent && filtered.length === 0 && (
          <div className="mt-20 text-center text-neutral-500">
            No components match your filters.
          </div>
        )}
      </div>
    </>
  )
}
