'use client'

import { useState } from 'react'

interface CopyPathButtonProps {
  relativePath: string
}

export default function CopyPathButton({ relativePath }: CopyPathButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(relativePath)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-300 transition-colors hover:border-neutral-600 hover:bg-neutral-700"
    >
      {copied ? 'Copied!' : 'Copy path'}
    </button>
  )
}
