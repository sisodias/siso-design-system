import { ComponentEntry } from '@/lib/types'
import Link from 'next/link'
import SourceBadge from './SourceBadge'

interface Props { component: ComponentEntry }

export default function Card({ component }: Props) {
  const href = `/?preview=${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`

  return (
    <Link href={href} scroll={false} className="group block">
      {/* Preview frame — fixed 4:3, contained, scaled via iframe */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 transition-all duration-200 group-hover:border-neutral-700 isolate"
        style={{
          contain: 'strict',
          ['--preview-scale' as string]: '0.5',
        }}
      >
        {component.preview?.renderable !== false ? (
          <iframe
            src={`/preview/${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`}
            title={component.displayName}
            className="h-full w-full border-0"
            style={{
              transform: `scale(var(--preview-scale, 0.5))`,
              transformOrigin: 'top left',
              width: 'calc(100% / 0.5)',
              height: 'calc(100% / 0.5)',
            }}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-center p-4">
            <div className="text-neutral-500">
              <div className="text-xs">Code reference</div>
              <div className="mt-1 text-[10px] opacity-60">Open to view source</div>
            </div>
          </div>
        )}
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
