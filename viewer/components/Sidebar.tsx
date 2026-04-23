'use client'
import Link from 'next/link'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Home, Package, Folder, Bookmark, FileCode, Wand2, Clock, ChevronDown, Star } from 'lucide-react'
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from '@/components/ui/tree'

type Mode = 'curated' | 'all' | 'generic'

interface SourceCount {
  source: string
  label: string
  count: number
}

type Facet = { value: string; count: number }

interface SidebarFacets {
  categories: Facet[]
  visualStyles: Facet[]
  industries: Facet[]
  complexity: Facet[]
}

interface Props {
  sourceCounts: SourceCount[]
  activeSource?: string
  onSourceFilter?: (source: string | null) => void
  onSearchChange?: (v: string) => void
  searchValue?: string
}

function FacetSection({
  label,
  facets,
  paramKey,
  activeValues,
}: {
  label: string
  facets: Facet[]
  paramKey: string
  activeValues: string[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const topFacets = facets.slice(0, 15)

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = activeValues.filter(v => v !== value)
    if (current.length > 0) {
      params.delete(paramKey)
      current.forEach(v => params.append(paramKey, v))
    } else {
      params.delete(paramKey)
    }
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  if (facets.length === 0) return null

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-1 px-3 py-1.5 text-left"
      >
        <ChevronDown className={`h-3 w-3 text-neutral-500 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`} />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{label}</span>
      </button>

      {open && (
        <div className="px-3 pb-1">
          {activeValues.length > 0 && (
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete(paramKey)
                router.push(`/?${params.toString()}`, { scroll: false })
              }}
              className="mb-1 text-[10px] text-neutral-500 hover:text-neutral-300"
            >
              Clear all
            </button>
          )}
          {topFacets.map(facet => {
            const active = activeValues.includes(facet.value)
            return (
              <button
                key={facet.value}
                onClick={() => toggle(facet.value)}
                className={`flex w-full items-center gap-2 rounded px-2 py-0.5 text-left text-xs transition-colors ${
                  active
                    ? 'bg-neutral-800 text-neutral-100'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-orange-400' : 'bg-neutral-600'}`} />
                <span className="flex-1 truncate">{facet.value}</span>
                <span className="text-neutral-600">{facet.count}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ sourceCounts, activeSource, onSourceFilter, onSearchChange, searchValue = '' }: Props) {
  const searchParams = useSearchParams()
  const modeRaw = searchParams.get('mode') as Mode | null
  const activeMode: Mode = modeRaw === 'all' || modeRaw === 'generic' ? modeRaw : 'curated'

  const [facets, setFacets] = useState<SidebarFacets | null>(null)

  useEffect(() => {
    fetch('/api/facets')
      .then(r => r.json())
      .then(data => {
        setFacets({
          categories: data.categories || [],
          visualStyles: data.visualStyles || [],
          industries: data.industries || [],
          complexity: data.complexity || [],
        })
      })
      .catch(() => {})
  }, [])

  const activeCategories = searchParams.getAll('category')
  const activeStyles = searchParams.getAll('style')
  const activeIndustries = searchParams.getAll('industry')
  const activeComplexities = searchParams.getAll('complexity')

  // Build mode-aware href (preserves other params)
  function modeHref(mode: Mode): string {
    const params = new URLSearchParams(searchParams.toString())
    if (mode === 'curated') {
      params.delete('mode')
    } else {
      params.set('mode', mode)
    }
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  // Tree selection reflects active source
  const selectedIds = activeSource === 'recent'
    ? ['recent']
    : activeSource
      ? [`source-${activeSource}`]
      : ['all']

  const handleSelectionChange = (ids: string[]) => {
    const id = ids[0]
    if (!id || id === 'all') {
      onSourceFilter?.(null)
      return
    }
    if (id === 'recent') {
      onSourceFilter?.('recent')
      return
    }
    if (id.startsWith('source-')) {
      onSourceFilter?.(id.slice('source-'.length))
    }
  }

  const modes: { value: Mode; label: string }[] = [
    { value: 'curated', label: 'Curated' },
    { value: 'all', label: 'All' },
    { value: 'generic', label: 'Generic' },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/" className="flex items-center gap-2 text-neutral-100 text-base font-semibold tracking-tight">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-orange-400 to-red-500 text-[11px] font-bold text-white">S</span>
          <span>SISO</span>
        </Link>
      </div>

      {/* Mode toggle */}
      <div className="px-3 pb-3">
        <div className="flex gap-1 rounded-md border border-neutral-800 bg-neutral-900 p-1">
          {modes.map(m => (
            <Link
              key={m.value}
              href={modeHref(m.value)}
              className={`flex-1 rounded-sm px-2 py-1 text-center text-[11px] font-medium transition-colors ${
                activeMode === m.value
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search"
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 py-1.5 pl-9 pr-10 text-sm placeholder-neutral-500 focus:border-neutral-600 focus:outline-none"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-400">⌘K</kbd>
        </div>
      </div>

      {/* Tree nav */}
      <nav className="flex-1 overflow-y-auto px-1 pb-6 text-sm">
        <TreeProvider
          defaultExpandedIds={['sources', 'build']}
          selectedIds={selectedIds}
          onSelectionChange={handleSelectionChange}
          indent={14}
        >
          <TreeView className="px-1">
            {/* All components */}
            <TreeNode nodeId="all">
              <TreeNodeTrigger>
                <TreeExpander />
                <TreeIcon icon={<Home className="h-4 w-4" />} />
                <TreeLabel>All components</TreeLabel>
              </TreeNodeTrigger>
            </TreeNode>

            {/* Recently added */}
            <TreeNode nodeId="recent">
              <TreeNodeTrigger>
                <TreeExpander />
                <TreeIcon icon={<Clock className="h-4 w-4" />} />
                <TreeLabel>Recently Added</TreeLabel>
              </TreeNodeTrigger>
            </TreeNode>

            {/* Sources group */}
            <TreeNode nodeId="sources">
              <TreeNodeTrigger>
                <TreeExpander hasChildren />
                <TreeIcon hasChildren />
                <TreeLabel className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Sources
                </TreeLabel>
              </TreeNodeTrigger>
              <TreeNodeContent hasChildren>
                {sourceCounts.map((sc, i) => (
                  <TreeNode
                    key={sc.source}
                    nodeId={`source-${sc.source}`}
                    level={1}
                    isLast={i === sourceCounts.length - 1}
                  >
                    <TreeNodeTrigger>
                      <TreeExpander />
                      <TreeIcon
                        icon={
                          sc.source === '21st-dev' ? (
                            <Package className="h-4 w-4" />
                          ) : (
                            <Folder className="h-4 w-4" />
                          )
                        }
                      />
                      <TreeLabel>{sc.label}</TreeLabel>
                      <span className="ml-auto pr-2 text-[11px] text-neutral-500">{sc.count}</span>
                    </TreeNodeTrigger>
                  </TreeNode>
                ))}
              </TreeNodeContent>
            </TreeNode>

            {/* AI Classification facets — inserted after Sources */}
            {facets && (
              <>
                <FacetSection
                  label="Category"
                  facets={facets.categories}
                  paramKey="category"
                  activeValues={activeCategories}
                />
                <FacetSection
                  label="Style"
                  facets={facets.visualStyles}
                  paramKey="style"
                  activeValues={activeStyles}
                />
                <FacetSection
                  label="Industry"
                  facets={facets.industries}
                  paramKey="industry"
                  activeValues={activeIndustries}
                />
                <FacetSection
                  label="Complexity"
                  facets={facets.complexity}
                  paramKey="complexity"
                  activeValues={activeComplexities}
                />
              </>
            )}

            {/* Rate link */}
            <TreeNode nodeId="rate">
              <TreeNodeTrigger>
                <TreeExpander />
                <TreeIcon icon={<Star className="h-4 w-4" />} />
                <Link href="/rate" className="flex-1 truncate text-sm">
                  Rate
                </Link>
              </TreeNodeTrigger>
            </TreeNode>

            {/* Build group */}
            <TreeNode nodeId="build">
              <TreeNodeTrigger>
                <TreeExpander hasChildren />
                <TreeIcon hasChildren />
                <TreeLabel className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Build
                </TreeLabel>
              </TreeNodeTrigger>
              <TreeNodeContent hasChildren>
                <TreeNode nodeId="build-compose" level={1}>
                  <TreeNodeTrigger>
                    <TreeExpander />
                    <TreeIcon icon={<Wand2 className="h-4 w-4" />} />
                    <Link href="/compose" className="flex-1 truncate text-sm">
                      Compose
                    </Link>
                  </TreeNodeTrigger>
                </TreeNode>
                <TreeNode nodeId="build-prompt" level={1}>
                  <TreeNodeTrigger>
                    <TreeExpander />
                    <TreeIcon icon={<FileCode className="h-4 w-4" />} />
                    <Link href="/export" className="flex-1 truncate text-sm">
                      Agent prompt
                    </Link>
                  </TreeNodeTrigger>
                </TreeNode>
                <TreeNode nodeId="build-promoted" level={1}>
                  <TreeNodeTrigger className="cursor-not-allowed opacity-50">
                    <TreeExpander />
                    <TreeIcon icon={<FileCode className="h-4 w-4" />} />
                    <TreeLabel>Promoted (soon)</TreeLabel>
                  </TreeNodeTrigger>
                </TreeNode>
                <TreeNode nodeId="build-bookmarks" level={1} isLast>
                  <TreeNodeTrigger className="cursor-not-allowed opacity-50">
                    <TreeExpander />
                    <TreeIcon icon={<Bookmark className="h-4 w-4" />} />
                    <TreeLabel>Bookmarks (soon)</TreeLabel>
                  </TreeNodeTrigger>
                </TreeNode>
              </TreeNodeContent>
            </TreeNode>
          </TreeView>
        </TreeProvider>
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-800 px-4 py-3 text-[11px] text-neutral-500">
        Design system v0.1 ·{' '}
        <a
          href="https://github.com/Lordsisodia/siso-design-system"
          className="text-neutral-400 hover:text-neutral-200"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </aside>
  )
}
