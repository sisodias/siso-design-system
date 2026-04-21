'use client'

import { useState, useMemo } from 'react'

interface FilterBarProps {
  sources: string[]
}

export default function FilterBar({ sources }: FilterBarProps) {
  const [search, setSearch] = useState('')
  const [activeSource, setActiveSource] = useState<string>('All')
  const [activePlatform, setActivePlatform] = useState<string>('All')

  const filters = [
    { label: 'All', value: 'All' },
    ...sources.map(s => ({ label: prettifySource(s), value: s })),
    { label: 'Mobile-only', value: 'Mobile-only' },
    { label: 'Mixed', value: 'Mixed' },
  ]

  const activeFilters = filters.filter(f => {
    if (f.value === 'All') return activeSource === 'All' && activePlatform === 'All'
    if (f.value === 'Mobile-only') return activePlatform === 'Mobile-only'
    if (f.value === 'Mixed') return activePlatform === 'Mixed'
    return activeSource === f.value
  })

  function handleFilterClick(value: string) {
    if (value === 'All') {
      setActiveSource('All')
      setActivePlatform('All')
    } else if (value === 'Mobile-only') {
      setActiveSource('All')
      setActivePlatform('Mobile-only')
    } else if (value === 'Mixed') {
      setActiveSource('All')
      setActivePlatform('Mixed')
    } else {
      setActiveSource(value)
      setActivePlatform('All')
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search components..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm placeholder-neutral-500 focus:border-neutral-600 focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              activeFilters.some(f => f.value === filter.value)
                ? 'bg-neutral-700 text-white'
                : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div
        id="filtered-count"
        data-search={search}
        data-source={activeSource}
        data-platform={activePlatform}
        className="hidden"
      />
    </div>
  )
}

function prettifySource(source: string): string {
  return source
    .replace('.dev', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
