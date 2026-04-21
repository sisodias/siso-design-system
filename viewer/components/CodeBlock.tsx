'use client'
import { useState } from 'react'

interface Props {
  filename: string
  content: string
  html: string
  defaultOpen?: boolean
}

export default function CodeBlock({ filename, content, html, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [copied, setCopied] = useState(false)
  const lineCount = content.split('\n').length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-neutral-800">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between bg-neutral-900 px-4 py-2 text-left text-sm hover:bg-neutral-800"
      >
        <div className="flex items-center gap-2">
          <span className={`inline-block text-xs text-neutral-500 transition-transform ${open ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span className="font-mono text-neutral-200">{filename}</span>
          <span className="text-xs text-neutral-500">{lineCount} lines</span>
        </div>
        <span className="text-xs text-neutral-500">
          {open ? 'click to collapse' : 'click to view'}
        </span>
      </button>
      {open && (
        <div className="border-t border-neutral-800 bg-neutral-950">
          <div className="flex justify-end border-b border-neutral-900 px-3 py-1">
            <button
              onClick={copy}
              className="rounded border border-neutral-700 bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300 hover:border-neutral-600"
            >
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>
          <div
            className="overflow-x-auto p-4 text-xs [&>pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  )
}
