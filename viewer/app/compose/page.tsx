import { Suspense } from 'react'
import type { Metadata } from 'next'
import ComposeClient from './ComposeClient'

export const metadata: Metadata = {
  title: 'Compose · SISO Design System',
  description: 'Build agent prompts, install commands, zip bundles, and shareable URLs from selected components.',
}

interface Props {
  searchParams: Promise<{ kit?: string }>
}

export default async function ComposePage({ searchParams }: Props) {
  const { kit } = await searchParams
  let prePopulated: { source: string; slug: string }[] = []

  if (kit) {
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(kit))))
      if (decoded.components && Array.isArray(decoded.components)) {
        prePopulated = decoded.components.filter(
          (c: unknown) =>
            typeof c === 'object' && c !== null &&
            typeof (c as { source?: unknown }).source === 'string' &&
            typeof (c as { slug?: unknown }).slug === 'string',
        )
      }
    } catch {
      // Invalid kit param — start empty
    }
  }

  return (
    <Suspense>
      <ComposeClient prePopulated={prePopulated} />
    </Suspense>
  )
}
