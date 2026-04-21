"use client"

import { Sparkles } from "lucide-react"

export interface ExampleComponentProps {
  title?: string
  subtitle?: string
}

/**
 * A minimal reference component.
 * Takes all data via props — no external state, no data fetching, no auth.
 * This is the contract every component in library/ should aim for.
 */
export default function ExampleComponent({
  title = "Example title",
  subtitle = "Example subtitle"
}: ExampleComponentProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className="text-sm font-medium text-neutral-100">{title}</div>
        <div className="text-xs text-neutral-400">{subtitle}</div>
      </div>
    </div>
  )
}
