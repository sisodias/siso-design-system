'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, ArrowUpRight, Copy, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ComponentEntry } from '@/lib/types'
// LivePreview replaced by iframe — see Content section below
import SourceBadge from './SourceBadge'
import Link from 'next/link'

interface Props {
  components: ComponentEntry[]
}

export default function PreviewModal({ components }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const previewParam = searchParams.get('preview')

  // Parse "source/name" from the query
  const current = useMemo(() => {
    if (!previewParam) return null
    const [source, ...nameParts] = previewParam.split('/')
    const name = nameParts.join('/')
    return components.find(c => c.source === source && c.name === name) ?? null
  }, [previewParam, components])

  const currentIndex = current ? components.findIndex(c => c.source === current.source && c.name === current.name) : -1

  const close = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('preview')
    const qs = params.toString()
    router.push(qs ? `/?${qs}` : '/', { scroll: false })
  }

  const navigate = (delta: number) => {
    if (currentIndex < 0) return
    const next = components[(currentIndex + delta + components.length) % components.length]
    const params = new URLSearchParams(searchParams.toString())
    params.set('preview', `${next.source}/${next.name}`)
    router.push(`/?${params.toString()}`, { scroll: false })
  }

  const [copied, setCopied] = useState(false)
  const copyPrompt = async () => {
    if (!current) return
    const prompt = `Use the \`${current.displayName}\` component from the SISO design system bank: \`${current.relativePath}\`\n\nDescription: ${current.description}\n\nGitHub: https://github.com/Lordsisodia/siso-design-system`
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  // Keyboard handlers
  useEffect(() => {
    if (!current) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') navigate(-1)
      else if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.source, current?.name])

  // Lock body scroll when open
  useEffect(() => {
    if (current) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [current])

  if (!current) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={close}>
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/70 px-5 py-3 backdrop-blur" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <SourceBadge source={current.source} />
          <span className="text-sm font-medium text-white">{current.displayName}</span>
          <span className="text-xs text-neutral-500">{current.platform}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyPrompt} className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500">
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy prompt'}
          </button>
          <Link href={`/component/${encodeURIComponent(current.source)}/${encodeURIComponent(current.name)}`} onClick={close} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 hover:border-neutral-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            Open
          </Link>
          <button onClick={close} className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600 hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Prev / Next */}
      <button onClick={(e) => { e.stopPropagation(); navigate(-1) }} className="absolute left-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-neutral-200 backdrop-blur hover:bg-neutral-800" aria-label="Previous">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); navigate(1) }} className="absolute right-4 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-neutral-200 backdrop-blur hover:bg-neutral-800" aria-label="Next">
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Content */}
      <div className="relative mx-auto max-h-[80vh] w-[min(90vw,1100px)] overflow-auto rounded-xl border border-neutral-800 bg-neutral-950 p-12 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex min-h-[500px] items-center justify-center">
          {current.preview?.renderable !== false ? (
            <iframe
              src={`/preview/${encodeURIComponent(current.source)}/${encodeURIComponent(current.name)}`}
              title={current.displayName}
              className="h-[500px] w-full border-0"
            />
          ) : (
            <div className="text-center text-sm text-neutral-500">
              {current.preview?.reason || 'Preview not renderable — open for code'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
