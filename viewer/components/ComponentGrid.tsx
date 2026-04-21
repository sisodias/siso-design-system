'use client'

import { useState, useMemo } from 'react'
import { ComponentEntry } from '@/lib/types'
import FilterBar from './FilterBar'
import Card from './Card'

interface ComponentGridProps {
  components: ComponentEntry[]
}

export default function ComponentGrid({ components }: ComponentGridProps) {
  const [search, setSearch] = useState('')
  const [activeSource, setActiveSource] = useState<string>('All')
  const [activePlatform, setActivePlatform] = useState<string>('All')

  const filtered = useMemo(() => {
    return components.filter(c => {
      if (activeSource !== 'All' && c.source !== activeSource) return false
      if (activePlatform === 'Mobile' && c.platform !== 'Mobile') return false
      if (activePlatform === 'Mixed' && c.platform !== 'Mixed') return false
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
  }, [components, search, activeSource, activePlatform])

  const sources = Array.from(new Set(components.map(c => c.source)))

  function handleSourceChange(value: string) {
    setActiveSource(value)
    if (value !== 'All') setActivePlatform('All')
  }

  function handlePlatformChange(value: string) {
    setActivePlatform(value)
    if (value !== 'All') setActiveSource('All')
  }

  return (
    <>
      <FilterBar
        sources={sources}
        search={search}
        activeSource={activeSource}
        activePlatform={activePlatform}
        onSearchChange={setSearch}
        onSourceChange={handleSourceChange}
        onPlatformChange={handlePlatformChange}
      />
      <div className="mt-4 text-sm text-neutral-500">
        {filtered.length} of {components.length} components
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(c => (
          <Card key={`${c.source}-${c.name}`} component={c} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-20 text-center text-neutral-500">
          No components match your filters.
        </div>
      )}
    </>
  )
}
