import { useState } from 'react'

type BlogSocialProps = {
  url: string
  title?: string
}

export default function BlogSocial({ url, title }: BlogSocialProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url.trim()
  if (!shareUrl) return null

  const copy = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // Fallback for older browsers / permission issues
      const textarea = document.createElement('textarea')
      textarea.value = shareUrl
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    } finally {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div className="rounded-3xl border border-semantic-legacy-brand-blush/60 bg-brand-porcelain/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">Share</div>
          <div className="mt-1 text-sm text-semantic-text-primary/80">Copy link or share this post.</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/70 bg-white px-4 py-2 text-sm font-semibold text-semantic-text-primary hover:bg-brand-porcelain"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title ?? '')}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/70 bg-white px-4 py-2 text-sm font-semibold text-semantic-text-primary hover:bg-brand-porcelain"
          >
            X
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-semantic-legacy-brand-blush/70 bg-white px-4 py-2 text-sm font-semibold text-semantic-text-primary hover:bg-brand-porcelain"
          >
            Facebook
          </a>
        </div>
      </div>
      <div className="mt-3 truncate rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white px-4 py-2 font-mono text-[12px] text-semantic-text-primary/70">
        {shareUrl}
      </div>
    </div>
  )
}
