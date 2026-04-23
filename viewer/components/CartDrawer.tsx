'use client'
import { useCart } from './CartProvider'
import CartToggleButton from './CartToggleButton'
import Link from 'next/link'
import { useState } from 'react'

export default function CartDrawer() {
  const { items, clear, count } = useCart()
  const [open, setOpen] = useState(false)

  const dimmed = count === 0

  return (
    <>
      {/* Pill trigger */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-lg transition-all ${
          dimmed
            ? 'border-neutral-800 bg-neutral-900/80 text-neutral-500'
            : 'border-green-700/60 bg-green-950/90 text-green-300 backdrop-blur hover:border-green-600 hover:bg-green-900/90'
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${dimmed ? 'bg-neutral-600' : 'bg-green-400 animate-pulse'}`} />
        {count === 0 ? '0 selected' : `${count} selected`}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } w-full max-w-md`}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          <h2 className="text-lg font-medium">Selected Components</h2>
          <button
            onClick={() => setOpen(false)}
            className="rounded p-1 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No components selected yet. Click <span className="text-neutral-300">+ Select</span> on any card to add it here.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={`${item.source}/${item.name}`} className="flex items-start justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-200 truncate">{item.displayName}</p>
                    <p className="text-xs text-neutral-500 truncate">
                      {item.source} — <code className="text-neutral-400">{item.relativePath}</code>
                    </p>
                  </div>
                  <CartToggleButton item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-800 px-5 py-4 flex gap-3">
            <Link
              href="/compose"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-center text-sm text-white hover:bg-green-600 transition-colors font-medium"
            >
              Go to Compose
            </Link>
            <Link
              href="/export"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-600 transition-colors"
            >
              Export
            </Link>
            <button
              onClick={() => { if (confirm('Clear all selected?')) clear() }}
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:border-neutral-600 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </>
  )
}
