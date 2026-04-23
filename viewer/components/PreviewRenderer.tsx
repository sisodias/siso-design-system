'use client'

import nextDynamic from 'next/dynamic'
import { Suspense, useMemo, type ComponentType } from 'react'
import { previewLoaders } from '@/lib/preview-imports.generated'
import ErrorBoundary from './ErrorBoundary'

interface Props {
  source: string
  slug: string
}

export default function PreviewRenderer({ source, slug }: Props) {
  const Demo: ComponentType = useMemo(() => {
    const key = `${source}/${slug}`
    const loader = previewLoaders[key]

    if (!loader) {
      const NotFound: ComponentType = () => (
        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
          Loader not found for {key}
        </div>
      )
      return NotFound
    }

    return nextDynamic(
      () =>
        loader()
          .then((m) => {
            const mod = m as { default?: ComponentType; DemoOne?: ComponentType } & Record<string, unknown>
            const picked =
              mod.default ||
              mod.DemoOne ||
              (Object.values(mod)[0] as ComponentType)
            if (!picked) {
              const fallback: ComponentType = () => (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                  No demo export found
                </div>
              )
              return { default: fallback }
            }
            return { default: picked }
          })
          .catch((err) => {
            console.error(`[PreviewRenderer] Failed to load demo for ${slug}:`, err)
            const fail: ComponentType = () => (
              <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                Failed to load preview
              </div>
            )
            return { default: fail }
          }),
      {
        ssr: false,
        loading: () => (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
            Loading…
          </div>
        ),
      }
    )
  }, [source, slug])

  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-full w-full items-center justify-center text-xs text-red-200/70">
          Preview crashed
        </div>
      }
    >
      <Suspense fallback={null}>
        <Demo />
      </Suspense>
    </ErrorBoundary>
  )
}
