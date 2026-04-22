import { SourceApp } from '@/lib/types'

interface SourceBadgeProps {
  source: SourceApp | string
}

const COLORS: Record<string, string> = {
  '21st-dev': 'bg-slate-700 text-slate-200',
}

const LABELS: Record<string, string> = {
  '21st-dev': '21st.dev',
}

export default function SourceBadge({ source }: SourceBadgeProps) {
  const colorClass = COLORS[source] || 'bg-neutral-700 text-neutral-300'
  const label = LABELS[source] || source

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  )
}
