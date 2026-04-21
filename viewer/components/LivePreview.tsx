'use client'

import dynamic from 'next/dynamic'
import { useMemo, Suspense, type ComponentType } from 'react'
import ErrorBoundary from './ErrorBoundary'
import available from '../app/_previews/_utils/available.json'

const AVAILABLE_SLUGS = new Set<string>(available.slugs)

interface Props {
  source: string
  slug: string
  /** 'scaled' = scale transform (detail page, backward compat). 'natural-centered' = no scale, centered + clipped. */
  mode?: 'scaled' | 'natural-centered'
  /** Scale factor — e.g. 0.4 for grid thumbnails, 1 for detail page. Only used when mode='scaled'. */
  scale?: number
  /** Container height in pixels. Default 300. Ignored when mode='natural-centered' (fills parent). */
  height?: number
  /** If true, the container ignores pointer events (so card Link still works). */
  inert?: boolean
}

export default function LivePreview({ source, slug, mode = 'scaled', scale = 1, height = 300, inert = false }: Props) {
  const isNatural = mode === 'natural-centered'

  // Only 21st.dev components have live previews right now,
  // and only if build-previews successfully copied the slug.
  if (source !== '21st.dev' || !AVAILABLE_SLUGS.has(slug)) {
    if (isNatural) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-neutral-950 p-6 text-center">
          <div className="text-neutral-600">
            <div className="mx-auto mb-2 h-8 w-8 rounded-full border border-dashed border-neutral-700" />
            <div className="text-[11px]">No live preview</div>
            <div className="mt-0.5 text-[10px] opacity-60">See code →</div>
          </div>
        </div>
      )
    }
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded border border-dashed border-neutral-800 bg-neutral-950/50 p-4 text-center text-xs text-neutral-500"
      >
        <div>
          <div className="mb-1">No live preview</div>
          <div className="text-[10px] opacity-60">
            {source !== '21st.dev'
              ? 'Source app component — broken imports preserved as reference'
              : 'Preview skipped — heavy deps or build errors, see code below'}
          </div>
        </div>
      </div>
    )
  }

  // Dynamic import the demo. Must use a template-literal slug path, and webpack-require.context-style magic
  // only works with static strings, so we use dynamic() with a constant-ish import pattern.
  const Demo: ComponentType = useMemo(() => {
    return dynamic(
      () =>
        import(`../app/_previews/${slug}/demo`)
          .then((mod: Record<string, unknown>) => {
            // 21st.dev convention: named export like DemoOne, Demo, or default
            const picked =
              (mod.DemoOne as ComponentType | undefined) ||
              (mod.default as ComponentType | undefined) ||
              (mod.Demo as ComponentType | undefined)
            if (!picked) {
              // Grab first exported function component
              for (const k of Object.keys(mod)) {
                const v = mod[k]
                if (typeof v === 'function') return { default: v as ComponentType }
              }
              throw new Error(`No exported demo component found in _previews/${slug}/demo.tsx`)
            }
            return { default: picked }
          })
          .catch(err => {
            console.error(`[LivePreview] Failed to load demo for ${slug}:`, err)
            // Return a fallback component module so next/dynamic doesn't break the whole tree
            const Fallback: ComponentType = () => (
              <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                Failed to load preview
              </div>
            )
            return { default: Fallback }
          }),
      {
        ssr: false,
        loading: () => (
          <div className="flex h-full items-center justify-center text-xs text-neutral-500">
            Loading preview…
          </div>
        ),
      }
    )
  }, [slug])

  if (isNatural) {
    return (
      <ErrorBoundary
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-xs text-red-200/70">
            Preview crashed — see code below
          </div>
        }
      >
        <div
          className="flex h-full w-full items-center justify-center overflow-hidden"
          style={{ pointerEvents: inert ? 'none' : 'auto' }}
        >
          <Suspense fallback={null}>
            <Demo />
          </Suspense>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary
      fallback={
        <div
          style={{ height }}
          className="flex items-center justify-center rounded border border-red-900/40 bg-red-950/20 text-xs text-red-200/70"
        >
          Preview crashed — see code below
        </div>
      }
    >
      <div
        style={{
          height,
          overflow: 'hidden',
          position: 'relative',
          pointerEvents: inert ? 'none' : 'auto',
        }}
        className="rounded border border-neutral-800 bg-neutral-950"
      >
        <div
          style={{
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top left',
            width: scale !== 1 ? `${100 / scale}%` : '100%',
            height: scale !== 1 ? `${100 / scale}%` : '100%',
          }}
        >
          <Suspense fallback={null}>
            <Demo />
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  )
}
