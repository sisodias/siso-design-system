import { ComponentEntry } from '@/lib/types'
import Link from 'next/link'
import LivePreview from './LivePreview'
import SourceBadge from './SourceBadge'

interface Props { component: ComponentEntry }

export default function Card({ component }: Props) {
  const href = `/?preview=${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`

  return (
    <Link href={href} scroll={false} className="group block">
      {/* Preview frame — fixed 4:3, contained, scaled */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 transition-all duration-200 group-hover:border-neutral-700 isolate"
        style={{
          contain: 'strict',
          // Each card renders the 600x450 viewport at ~0.5x → 300x225, fits any card >=300px wide
          ['--preview-scale' as string]: '0.5',
        }}
      >
        <LivePreview
          source={component.source}
          slug={component.name}
          mode="natural-centered"
          inert={true}
        />
      </div>

      {/* Title row — always visible, below the card (like 21st.dev) */}
      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-neutral-200 group-hover:text-white">
            {component.displayName}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <SourceBadge source={component.source} />
        </div>
      </div>
    </Link>
  )
}
