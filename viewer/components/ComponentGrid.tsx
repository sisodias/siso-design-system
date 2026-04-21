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
  'lumelle': 'Lumelle (mobile)',
  'restaurant-app-solo': 'Restaurant (mobile)',
  '21st.dev': '21st.dev',
}

function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source
}

export default function ComponentGrid({ components }: ComponentGridProps) {
  const [search, setSearch] = useState('')
  const [activeSource, setActiveSource] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return components.filter(c => {
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
        <Breadcrumb items={[{ label: 'Bookmarks', href: '/' }, { label: activeSource ?? 'Components' }]} />
        <h1 className="mt-3 mb-6 text-2xl font-medium">{activeSource ? sourceLabel(activeSource) : 'All components'}</h1>
        <div className="mb-4 text-sm text-neutral-500">
          {filtered.length} {filtered.length === 1 ? 'component' : 'components'}
        </div>
      </div>
      <div className="px-10 pb-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(c => (
            <Card key={`${c.source}-${c.name}`} component={c} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-20 text-center text-neutral-500">
            No components match your filters.
          </div>
        )}
      </div>
    </>
  )
}
