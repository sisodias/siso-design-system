'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Home, Package, Folder, Bookmark, FileCode, Wand2 } from 'lucide-react'

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
      <div className="px-3 pb-4">
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

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-6 text-sm">
        <NavButton active={activeSource === undefined} onClick={() => onSourceFilter?.(null)} icon={<Home className="h-4 w-4" />}>
          All components
        </NavButton>

        <NavSectionHeader>Sources</NavSectionHeader>
        {sourceCounts.map(sc => (
          <NavButton
            key={sc.source}
            active={activeSource === sc.source}
            onClick={() => onSourceFilter?.(sc.source)}
            icon={sc.source === '21st.dev' ? <Package className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
            count={sc.count}
          >
            {sc.label}
          </NavButton>
        ))}

        <NavSectionHeader>Build</NavSectionHeader>
        <NavButtonLink href="/export" icon={<Wand2 className="h-4 w-4" />}>
          Agent prompt
        </NavButtonLink>
        <NavButtonDisabled icon={<FileCode className="h-4 w-4" />}>
          Promoted (coming soon)
        </NavButtonDisabled>
        <NavButtonDisabled icon={<Bookmark className="h-4 w-4" />}>
          Bookmarks (coming soon)
        </NavButtonDisabled>
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-800 px-4 py-3 text-[11px] text-neutral-500">
        Design system v0.1 · <a href="https://github.com/Lordsisodia/siso-design-system" className="text-neutral-400 hover:text-neutral-200" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </aside>
  )
}

function NavSectionHeader({ children }: { children: React.ReactNode }) {
  return <div className="mt-5 mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{children}</div>
}

function NavButton({ active, onClick, icon, count, children }: { active?: boolean, onClick?: () => void, icon?: React.ReactNode, count?: number, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left transition-colors ${active ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'}`}
    >
      <span className="flex items-center gap-2">{icon}{children}</span>
      {count !== undefined && <span className={`text-xs ${active ? 'text-neutral-300' : 'text-neutral-500'}`}>{count}</span>}
    </button>
  )
}

function NavButtonLink({ href, icon, children }: { href: string, icon?: React.ReactNode, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white">
      {icon}{children}
    </Link>
  )
}

function NavButtonDisabled({ icon, children }: { icon?: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-neutral-600 cursor-not-allowed">
      {icon}{children}
    </div>
  )
}
