'use client'

interface FilterBarProps {
  sources: string[]
  search: string
  activeSource: string
  activePlatform: string
  onSearchChange: (v: string) => void
  onSourceChange: (v: string) => void
  onPlatformChange: (v: string) => void
}

export default function FilterBar({
  sources,
  search,
  activeSource,
  activePlatform,
  onSearchChange,
  onSourceChange,
  onPlatformChange,
}: FilterBarProps) {
  function prettifySource(source: string): string {
    return source
      .replace('.dev', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  }

  const allFilters = [
    { label: 'All', value: 'All' },
    ...sources.map(s => ({ label: prettifySource(s), value: s })),
    { label: 'Mobile', value: 'Mobile' },
    { label: 'Mixed', value: 'Mixed' },
  ]

  function isActive(value: string) {
    if (value === 'All') return activeSource === 'All' && activePlatform === 'All'
    if (value === 'Mobile') return activePlatform === 'Mobile'
    if (value === 'Mixed') return activePlatform === 'Mixed'
    return activeSource === value
  }

  function handleFilterClick(value: string) {
    if (value === 'All') {
      onSourceChange('All')
      onPlatformChange('All')
    } else if (value === 'Mobile') {
      onPlatformChange('Mobile')
      onSourceChange('All')
    } else if (value === 'Mixed') {
      onPlatformChange('Mixed')
      onSourceChange('All')
    } else {
      onSourceChange(value)
      onPlatformChange('All')
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search components..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm placeholder-neutral-500 focus:border-neutral-600 focus:outline-none"
      />

      <div className="flex flex-wrap gap-2">
        {allFilters.map(filter => (
          <button
            key={filter.value}
            onClick={() => handleFilterClick(filter.value)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              isActive(filter.value)
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
