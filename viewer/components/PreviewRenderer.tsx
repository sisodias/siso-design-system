'use client'

import nextDynamic from 'next/dynamic'
import { Suspense, useMemo, type ComponentType } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface Props {
  source: string
  slug: string
}

export default function PreviewRenderer({ source, slug }: Props) {
  const Demo: ComponentType = useMemo(() => {
    if (source !== '21st-dev') {
      const Empty: ComponentType = () => (
        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
          Live preview only available for 21st-dev components
        </div>
      )
      return Empty
    }
    return nextDynamic(
      () =>
        import(`@lib/21st-dev/${slug}/demo`)
          .then((m: Record<string, unknown>) => {
            const picked =
              (m.DemoOne as ComponentType | undefined) ||
              (m.default as ComponentType | undefined) ||
              (m.Demo as ComponentType | undefined)
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
          .catch(err => {
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
