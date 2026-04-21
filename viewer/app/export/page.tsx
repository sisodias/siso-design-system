'use client'
import { useCart } from '@/components/CartProvider'
import Link from 'next/link'
import { useState } from 'react'

export default function ExportPage() {
  const { items, clear } = useCart()
  const [copied, setCopied] = useState(false)
  const [style, setStyle] = useState<'agent' | 'list' | 'markdown'>('agent')

  const prompt = buildPrompt(items, style)
  const copy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-200">← Back to browse</Link>
      <header className="mt-6 mb-6">
        <h1 className="text-3xl font-medium">Export Selection</h1>
        <p className="mt-1 text-sm text-neutral-400">{items.length} component{items.length === 1 ? '' : 's'} selected</p>
      </header>

      {items.length === 0 ? (
        <p className="text-neutral-500">No components selected yet. <Link href="/" className="text-neutral-300 underline">Browse</Link> and click + Select on cards.</p>
      ) : (
        <>
          <div className="mb-4 flex gap-2">
            {(['agent', 'list', 'markdown'] as const).map(s => (
              <button key={s} onClick={() => setStyle(s)} className={`rounded-full px-3 py-1 text-sm ${style === s ? 'bg-neutral-700 text-white' : 'bg-neutral-800 text-neutral-400'}`}>{s === 'agent' ? 'Agent Prompt' : s === 'list' ? 'Path List' : 'Markdown'}</button>
            ))}
          </div>

          <div className="mb-4 flex gap-2">
            <button onClick={copy} className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-600">
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
            <button onClick={() => { if (confirm('Clear all selected?')) clear() }} className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-600">Clear selection</button>
          </div>

          <pre className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-200 whitespace-pre-wrap break-words">
            {prompt}
          </pre>
        </>
      )}
    </main>
  )
}

function buildPrompt(items: { source: string; name: string; displayName: string; relativePath: string; description: string }[], style: 'agent' | 'list' | 'markdown'): string {
  if (items.length === 0) return ''
  if (style === 'list') {
    return items.map(i => i.relativePath).join('\n')
  }
  if (style === 'markdown') {
    return items.map(i => `- **${i.displayName}** (${i.source}) — \`${i.relativePath}\`\n  ${i.description}`).join('\n\n')
  }
  const lines = [
    'Build me a feature using these components from the SISO design system bank at',
    'https://github.com/Lordsisodia/siso-design-system (preserved-as-reference copies, broken imports are documented inside each folder).',
    '',
    'Components to use:',
    ...items.map(i => `- \`${i.relativePath}\` — ${i.displayName} (${i.source}): ${i.description}`),
    '',
    'Harvest rules:',
    '1. Read each component folder\'s README.md first to understand its contract + broken imports.',
    '2. Components in `_raw/{app}/` are mobile-first and have broken imports — resolve them using the adapter contracts in `adapters/` or stub them.',
    '3. Components in `_external/21st-dev/` are already plug-and-play.',
    '4. Use `tokens/lumelle/` if the feature needs Lumelle\'s peach/cocoa palette, otherwise wire your own tokens.',
    '5. Preserve the visual design exactly — only touch imports and data wiring.',
    '',
    'Your job: combine these components into a working mobile screen + wire the 5 adapters (auth, cart, analytics, content, image) per `adapters/README.md`. Report back when done.',
  ]
  return lines.join('\n')
}
