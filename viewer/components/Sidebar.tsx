'use client'
import Link from 'next/link'
import { Search, Home, Package, Folder, Bookmark, FileCode, Wand2, Clock } from 'lucide-react'
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

interface SourceCount {
  source: string
  label: string
  count: number
}

interface Props {
  sourceCounts: SourceCount[]
  activeSource?: string
  onSourceFilter?: (source: string | null) => void
  onSearchChange?: (v: string) => void
  searchValue?: string
}

export default function Sidebar({ sourceCounts, activeSource, onSourceFilter, onSearchChange, searchValue = '' }: Props) {
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

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-neutral-800 bg-neutral-950 flex flex-col">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4">
        <Link href="/" className="flex items-center gap-2 text-neutral-100 text-base font-semibold tracking-tight">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-orange-400 to-red-500 text-[11px] font-bold text-white">S</span>
          <span>SISO</span>
        </Link>
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
                <TreeNode nodeId="build-prompt" level={1}>
                  <TreeNodeTrigger>
                    <TreeExpander />
                    <TreeIcon icon={<Wand2 className="h-4 w-4" />} />
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
