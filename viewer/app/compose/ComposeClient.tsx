'use client'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import type { CartItem } from '@/components/CartProvider'
import type { ComposeFormat, ComposeComponent } from '@/lib/compose'

type Format = Exclude<ComposeFormat, 'registry'>

const FORMAT_LABELS: Record<Format, string> = {
  'agent-prompt': 'Agent Prompt',
  install: 'Install Command',
  zip: 'Zip Download',
  share: 'Share URL',
}

interface PrePopulatedItem {
  source: string
  slug: string
}

interface Props {
  prePopulated?: PrePopulatedItem[]
}

export default function ComposeClient({ prePopulated = [] }: Props) {
  const { items, remove } = useCart()
  const [format, setFormat] = useState<Format>('agent-prompt')
  const [brief, setBrief] = useState('')
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy')
  const [error, setError] = useState<string | null>(null)

  // If kit param pre-populated, use those; otherwise fall back to cart
  const activeItems = prePopulated.length > 0 ? prePopulated : items
  const hasCart = items.length > 0 || prePopulated.length > 0

  // When format changes, re-fetch preview
  useEffect(() => {
    if (!hasCart) return
    setLoading(true)
    setError(null)

    const components: ComposeComponent[] = activeItems.map((item: CartItem | PrePopulatedItem) => ({
      source: item.source,
      slug: 'name' in item ? item.name : (item as PrePopulatedItem).slug,
    }))

    if (format === 'zip') {
      // zip is downloaded directly, not previewed as text
      setPreview('[ Click Download to get the zip bundle ]')
      setLoading(false)
      return
    }

    fetch('/api/compose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ components, format, options: { brief } }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: res.statusText }))
          throw new Error(err.error ?? res.statusText)
        }
        return format === 'share' ? res.json() : res.text()
      })
      .then((data) => {
        if (format === 'share') {
          const { url } = data as { url: string }
          setPreview(`${window.location.origin}${url}`)
        } else {
          setPreview(data as string)
        }
      })
      .catch((err: Error) => {
        setError(err.message)
        setPreview('')
      })
      .finally(() => setLoading(false))
  }, [format, brief, activeItems, hasCart])

  const handleCopy = useCallback(async () => {
    if (!preview) return
    try {
      await navigator.clipboard.writeText(preview)
      setCopyLabel('Copied!')
      setCopied(true)
      setTimeout(() => {
        setCopyLabel('Copy')
        setCopied(false)
      }, 2000)
    } catch {
      setCopyLabel('Failed')
    }
  }, [preview])

  const handleDownload = useCallback(async () => {
    if (!hasCart) return
    setLoading(true)
    setError(null)

    const components: ComposeComponent[] = activeItems.map((item: CartItem | PrePopulatedItem) => ({
      source: item.source,
      slug: 'name' in item ? item.name : (item as PrePopulatedItem).slug,
    }))

    try {
      const res = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components, format: 'zip', options: { brief } }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error ?? res.statusText)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'siso-kit.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Download failed')
    } finally {
      setLoading(false)
    }
  }, [activeItems, hasCart, brief])

  const handleShare = useCallback(async () => {
    if (!hasCart) return
    setLoading(true)
    setError(null)

    const components: ComposeComponent[] = activeItems.map((item: CartItem | PrePopulatedItem) => ({
      source: item.source,
      slug: 'name' in item ? item.name : (item as PrePopulatedItem).slug,
    }))

    try {
      const res = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components, format: 'share' }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error ?? res.statusText)
      }
      const { url } = await res.json() as { url: string }
      const fullUrl = `${window.location.origin}${url}`
      await navigator.clipboard.writeText(fullUrl)
      setCopyLabel('URL Copied!')
      setCopied(true)
      setTimeout(() => {
        setCopyLabel('Copy')
        setCopied(false)
      }, 2000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Share failed')
    } finally {
      setLoading(false)
    }
  }, [activeItems, hasCart])

  if (!hasCart) {
    return (
      <main className="pl-64 mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-12 text-center">
          <p className="text-lg text-neutral-400">No components selected.</p>
          <p className="mt-2 text-sm text-neutral-500">
            <Link href="/" className="text-neutral-300 underline hover:text-neutral-100">
              Browse the library
            </Link>{' '}
            and click + Select on any card to add components here.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="pl-64 mx-auto max-w-6xl px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300">
            ← Back to browse
          </Link>
          <h1 className="mt-2 text-3xl font-medium">Compose Kit</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {activeItems.length} component{activeItems.length === 1 ? '' : 's'} selected
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-600"
        >
          + Add more
        </Link>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left: cart items */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
          <div className="border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Selected Components</h2>
            <span className="text-xs text-neutral-500">{activeItems.length}</span>
          </div>
          <ul className="divide-y divide-neutral-800 max-h-[60vh] overflow-y-auto">
            {activeItems.map((item: CartItem | PrePopulatedItem, idx: number) => {
              const source = item.source
              const name = 'name' in item ? item.name : (item as PrePopulatedItem).slug
              const displayName = 'displayName' in item ? item.displayName : name
              const relativePath = 'relativePath' in item ? item.relativePath : `library/${source}/${name}/`
              const isRemovable = 'remove' in { remove } && 'source' in item
              return (
                <li
                  key={`${source}/${name}-${idx}`}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-200 truncate">{displayName}</p>
                    <p className="text-xs text-neutral-500 truncate">
                      {source} — <code className="text-neutral-400">{relativePath}</code>
                    </p>
                  </div>
                  {isRemovable && (
                    <button
                      onClick={() => remove(source, name)}
                      className="shrink-0 rounded p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-800"
                      title="Remove"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* Right: format toggle + preview + actions */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden flex flex-col">
          {/* Format toggle */}
          <div className="border-b border-neutral-800 px-4 py-3">
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    format === f
                      ? 'bg-green-700 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {FORMAT_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {/* Brief input for agent-prompt */}
          {format === 'agent-prompt' && (
            <div className="border-b border-neutral-800 px-4 py-3">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                User brief (optional)
              </label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="e.g. Build a pricing page with a hero section and footer."
                rows={3}
                className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:border-neutral-600 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Preview */}
          <div className="flex-1 px-4 py-3 min-h-0">
            <div className="h-full">
              {loading ? (
                <div className="flex items-center justify-center h-32 text-neutral-500 text-sm">
                  Loading...
                </div>
              ) : error ? (
                <div className="rounded-md border border-red-900/50 bg-red-950/20 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              ) : (
                <pre className="h-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-200 whitespace-pre-wrap break-words overflow-auto max-h-[40vh]">
                  {preview}
                </pre>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="border-t border-neutral-800 px-4 py-3 flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              disabled={loading || !!error || !preview}
              className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {copied ? 'Copied!' : copyLabel}
            </button>

            {format === 'zip' && (
              <button
                onClick={handleDownload}
                disabled={loading}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-200 hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Building zip...' : 'Download'}
              </button>
            )}

            {format === 'share' && (
              <button
                onClick={handleShare}
                disabled={loading}
                className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-200 hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating URL...' : 'Copy Share URL'}
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
