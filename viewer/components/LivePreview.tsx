'use client'

import dynamic from 'next/dynamic'
import { useMemo, Suspense, type ComponentType } from 'react'
import ErrorBoundary from './ErrorBoundary'
import available from '../app/_previews/_utils/available.json'

const AVAILABLE_SLUGS = new Set<string>(available.slugs)

interface Props {
  source: string
  slug: string
  /** Scale factor — e.g. 0.4 for grid thumbnails, 1 for detail page. */
  scale?: number
  /** Container height in pixels. Default 300. */
  height?: number
  /** If true, the container ignores pointer events (so card Link still works). */
  inert?: boolean
}

export default function LivePreview({ source, slug, scale = 1, height = 300, inert = false }: Props) {
  // Only 21st.dev components have live previews right now,
  // and only if build-previews successfully copied the slug.
  if (source !== '21st.dev' || !AVAILABLE_SLUGS.has(slug)) {
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
