import { ComponentEntry } from '@/lib/types'
import Link from 'next/link'
import CartToggleButton from './CartToggleButton'
import LivePreview from './LivePreview'
import SourceBadge from './SourceBadge'

interface Props { component: ComponentEntry }

export default function Card({ component }: Props) {
  const href = `/?preview=${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`
  const cartItem = {
    source: component.source,
    name: component.name,
    displayName: component.displayName,
    relativePath: component.relativePath,
    description: component.description,
  }

  return (
    <div className="group relative">
      <Link href={href} scroll={false} className="block">
        <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all duration-200 group-hover:border-neutral-700 group-hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
          {/* Preview — contain:strict caps any escaping child (fixed/absolute elements stay inside) */}
          <div
            className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 isolate"
            style={{ contain: 'strict' }}
          >
            <LivePreview
              source={component.source}
              slug={component.name}
              mode="natural-centered"
              height={undefined}
              inert={true}
            />
          </div>

          {/* Hover title overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">{component.displayName}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-neutral-400">
                  <SourceBadge source={component.source} />
                  <span>{component.platform}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Select button — top-right, visible always */}
      <div className="pointer-events-auto absolute right-2 top-2 z-10">
        <CartToggleButton item={cartItem} />
      </div>
    </div>
  )
}
