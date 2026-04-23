'use client'

import { useEffect, useState, type ComponentType } from 'react'
import ErrorBoundary from './ErrorBoundary'

interface Props {
  source: string
  slug: string
}

function LoadError({ slug }: { slug: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-xs text-red-200/70">
      Failed to load {slug}
    </div>
  )
}

// Per-source require.context calls — webpack creates one context module per source
// that maps keys (e.g. "notification") to modules.  require.context is a single
// synchronous call that returns a map; webpack does NOT create a separate chunk
// per entry.  This avoids the chunk-splitter overload that 3,070 literal import()
// calls cause (F1) while also avoiding the glob-enumeration that template-literal
// import() triggers under externalDir:true.
//
// The relative path "../../library/{source}/" is resolved from the generated
// context module location (viewer/.next/server/...), so it points back to the
// library source directory correctly.
type DemoMap = Record<string, { default?: ComponentType; DemoOne?: ComponentType } & Record<string, unknown>>

function makeDemoResolver(source: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = (require as any).context(`../../library/${source}/`, false, /^(?!.*\/_).*\/demo\.tsx?$/)
  return (slug: string): ComponentType | null => {
    try {
      const mod: DemoMap = ctx(`./${slug}/demo`) || {}
      const picked =
        mod.default ||
        mod.DemoOne ||
        (Object.values(mod)[0] as ComponentType | undefined)
      return picked || null
    } catch {
      return null
    }
  }
}

export default function PreviewRenderer({ source, slug }: Props) {
  const [Demo, setDemo] = useState<ComponentType | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    setDemo(null)
    setLoadFailed(false)
    try {
      const resolver = makeDemoResolver(source)
      const Component = resolver(slug)
      if (Component) setDemo(() => Component)
      else setLoadFailed(true)
    } catch (err) {
      console.error(`[PreviewRenderer] Failed to load demo for ${source}/${slug}:`, err)
      setLoadFailed(true)
    }
  }, [source, slug])

  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-full w-full items-center justify-center text-xs text-red-200/70">
          Preview crashed
        </div>
      }
    >
      {loadFailed ? <LoadError slug={slug} /> : Demo ? <Demo /> : <div />}
    </ErrorBoundary>
  )
}
