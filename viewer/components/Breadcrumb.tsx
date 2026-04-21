import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-neutral-400">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-neutral-200">{item.label}</Link>
          ) : (
            <span className={i === items.length - 1 ? 'text-neutral-200' : ''}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
