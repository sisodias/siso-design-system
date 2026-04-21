import { ComponentEntry } from '@/lib/types'
import SourceBadge from './SourceBadge'
import CartToggleButton from './CartToggleButton'
import LivePreview from './LivePreview'
import Link from 'next/link'

interface CardProps {
  component: ComponentEntry
}

export default function Card({ component }: CardProps) {
  const href = `/component/${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`
  const cartItem = {
    source: component.source,
    name: component.name,
    displayName: component.displayName,
    relativePath: component.relativePath,
    description: component.description,
  }

  return (
    <Link
      href={href}
      className="group relative block rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden transition-all hover:-translate-y-0.5 hover:border-neutral-700 hover:bg-neutral-900"
    >
      {/* Live preview thumbnail */}
      <LivePreview source={component.source} slug={component.name} scale={0.4} height={200} inert={true} />

      {/* Cart toggle top-right — sits over the preview */}
      <div className="absolute top-2 right-2 z-10" onClick={e => e.preventDefault()}>
        <CartToggleButton item={cartItem} />
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <SourceBadge source={component.source} />
          <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-400">
            {component.platform}
          </span>
        </div>

        <h3 className="mb-2 text-lg font-medium group-hover:text-white">{component.displayName}</h3>

        <p className="mb-3 text-sm text-neutral-400 line-clamp-2">
          {component.description}
        </p>

        {component.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {component.tags.slice(0, 3).map(tag => (
              <span key={tag} className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        <span className="text-sm text-neutral-500 group-hover:text-neutral-300">
          View →
        </span>
      </div>
    </Link>
  )
}
