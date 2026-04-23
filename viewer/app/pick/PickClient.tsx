'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentEntry } from '@/lib/types'
import {
  buildCallbackPayload,
  buildCancelPayload,
  resolveTargetOrigin,
  encodeRedirectPayload,
} from '@/lib/pick'
import PickCard from './PickCard'

interface Props {
  components: ComponentEntry[]
  session: string
  mode: 'single' | 'multi'
  callbackMode: 'postMessage' | 'redirect' | 'webhook'
  callbackUrl: string | null
  preselect: string[]
  caller: string | null
  totalMatched: number
  limit: number
}

type FireState = 'idle' | 'picked' | 'cancelled' | 'error'

export default function PickClient({
  components,
  session,
  mode,
  callbackMode,
  callbackUrl,
  preselect,
  caller,
  totalMatched,
  limit,
}: Props) {
  // ----------------------------------------------------------------------------------------------
  // State
  // ----------------------------------------------------------------------------------------------

  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(() => {
    // Preselect: match "source/slug" pairs
    if (preselect.length === 0) return new Set()
    const selected = new Set<string>()
    for (const token of preselect) {
      const match = components.find(
        c => `${c.source}/${c.name}` === token,
      )
      if (match) selected.add(`${match.source}/${match.name}`)
    }
    return selected
  })
  const [fired, setFired] = useState<FireState>('idle')
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)

  const firedRef = useRef(fired)
  firedRef.current = fired

  // ----------------------------------------------------------------------------------------------
  // Iframe detection
  // ----------------------------------------------------------------------------------------------

  const isEmbeddable =
    typeof window !== 'undefined' &&
    callbackMode === 'postMessage' &&
    window.self !== window.top

  const isStandaloneNoParent =
    typeof window !== 'undefined' &&
    callbackMode === 'postMessage' &&
    window.self === window.top

  // ----------------------------------------------------------------------------------------------
  // Filtered component list (search)
  // ----------------------------------------------------------------------------------------------

  const filteredComponents = searchQuery.trim()
    ? components.filter(c => {
        const q = searchQuery.toLowerCase()
        return (
          c.displayName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.aiSummary?.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        )
      })
    : components

  // ----------------------------------------------------------------------------------------------
  // Selection helpers
  // ----------------------------------------------------------------------------------------------

  const isSelected = useCallback(
    (c: ComponentEntry) => selectedComponents.has(`${c.source}/${c.name}`),
    [selectedComponents],
  )

  const handlePick = useCallback(
    (component: ComponentEntry) => {
      if (firedRef.current !== 'idle') return

      const key = `${component.source}/${component.name}`

      if (mode === 'single') {
        // Single mode: clear previous, select only this one
        setSelectedComponents(new Set([key]))
        setSelectedIndex(components.indexOf(component))
      } else {
        // Multi mode: toggle
        setSelectedComponents(prev => {
          const next = new Set(prev)
          if (next.has(key)) {
            next.delete(key)
          } else {
            next.add(key)
          }
          return next
        })
      }
    },
    [mode, components],
  )

  // ----------------------------------------------------------------------------------------------
  // Fire callbacks
  // ----------------------------------------------------------------------------------------------

  const firePick = useCallback(() => {
    if (firedRef.current !== 'idle') return
    setFired('picked')

    const picked = components.filter(c => selectedComponents.has(`${c.source}/${c.name}`))
    if (picked.length === 0) {
      setFired('idle')
      return
    }

    const payload = buildCallbackPayload(picked, session, mode)

    if (callbackMode === 'postMessage') {
      const target = resolveTargetOrigin(callbackUrl)
      window.parent.postMessage(payload, target)
    } else if (callbackMode === 'redirect') {
      const encoded = encodeRedirectPayload(payload)
      const base = callbackUrl ?? ''
      window.location.href = `${base}${base.includes('?') ? '&' : '?'}siso_picked=${encoded}&session=${session}`
    } else if (callbackMode === 'webhook') {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 8000)

      fetch(callbackUrl ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(data => {
          clearTimeout(timeout)
          if (data?.redirect) {
            window.location.href = data.redirect
          }
        })
        .catch(() => {
          clearTimeout(timeout)
          setFired('error')
        })
    }
  }, [components, selectedComponents, session, mode, callbackMode, callbackUrl])

  const fireCancel = useCallback(
    (reason: 'user_escaped' | 'user_closed' | 'timeout') => {
      if (firedRef.current !== 'idle') return
      setFired('cancelled')

      const payload = buildCancelPayload(session, reason)

      if (callbackMode === 'postMessage') {
        const target = resolveTargetOrigin(callbackUrl)
        window.parent.postMessage(payload, target)
      } else if (callbackMode === 'redirect' && callbackUrl) {
        // For redirect mode, cancel just closes
      }
    },
    [session, callbackMode, callbackUrl],
  )

  // ----------------------------------------------------------------------------------------------
  // Keyboard navigation
  // ----------------------------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey

      // Cmd+K: toggle search
      if (isMeta && e.key === 'k') {
        e.preventDefault()
        setSearchVisible(v => !v)
        return
      }

      // ?: toggle shortcuts
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        setShowShortcuts(v => !v)
        return
      }

      // Escape: cancel
      if (e.key === 'Escape') {
        e.preventDefault()
        fireCancel('user_escaped')
        return
      }

      // Arrow keys: move selection
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => (i + 1) % filteredComponents.length)
        return
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => (i - 1 + filteredComponents.length) % filteredComponents.length)
        return
      }

      // Enter/Space: pick focused card
      if ((e.key === 'Enter' || e.key === ' ') && !isMeta && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredComponents.length) {
          handlePick(filteredComponents[selectedIndex])
        }
        return
      }

      // Cmd+Enter / Ctrl+Enter: submit multi selection
      if (isMeta && e.key === 'Enter') {
        e.preventDefault()
        if (mode === 'multi' && selectedComponents.size > 0) {
          firePick()
        }
        return
      }

      // 1-9: jump to nth card
      if (/^[1-9]$/.test(e.key) && !isMeta && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        const idx = parseInt(e.key, 10) - 1
        if (idx < filteredComponents.length) {
          setSelectedIndex(idx)
        }
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredComponents, selectedIndex, selectedComponents, mode, firePick, fireCancel, handlePick])

  // ----------------------------------------------------------------------------------------------
  // Scroll selected card into view
  // ----------------------------------------------------------------------------------------------

  useEffect(() => {
    if (selectedIndex < 0) return
    const el = document.querySelector(`[data-index="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [selectedIndex])

  // ----------------------------------------------------------------------------------------------
  // Short session id (first 8 chars)
  // ----------------------------------------------------------------------------------------------

  const shortSession = session.slice(0, 8)

  // ----------------------------------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------------------------------

  return (
    <div className="bg-neutral-950 text-white min-h-screen flex flex-col">
      {/* Standalone error */}
      {isStandaloneNoParent && (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-md rounded-xl border border-red-800 bg-red-950/50 p-6 text-center">
            <div className="mb-3 text-2xl font-semibold text-red-400">Parent window required</div>
            <p className="text-sm text-neutral-400">
              This picker was opened without a parent window. For pickers opened directly in a tab,
              use{' '}
              <code className="text-xs text-red-300">?callbackMode=redirect&amp;callbackUrl=...</code>{' '}
              instead.
            </p>
          </div>
        </div>
      )}

      {/* Fired: picked */}
      {fired === 'picked' && (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-xl border border-blue-800 bg-blue-950/50 p-8 text-center">
            <div className="mb-2 text-2xl font-semibold text-blue-400">Selection sent</div>
            <p className="text-sm text-neutral-400">
              {mode === 'single' ? '1 component' : `${selectedComponents.size} components`} picked.
              {callbackMode === 'postMessage' ? ' Waiting for parent window...' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Fired: cancelled */}
      {fired === 'cancelled' && (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-8 text-center">
            <div className="mb-2 text-xl font-medium text-neutral-400">Cancelled</div>
            <p className="text-sm text-neutral-500">Picker closed without a selection.</p>
          </div>
        </div>
      )}

      {/* Fired: error */}
      {fired === 'error' && (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="rounded-xl border border-red-800 bg-red-950/50 p-8 text-center">
            <div className="mb-2 text-xl font-semibold text-red-400">Webhook failed</div>
            <p className="text-sm text-neutral-400">
              Could not reach {callbackUrl}. Please check the callback URL and try again.
            </p>
          </div>
        </div>
      )}

      {/* Idle state */}
      {fired === 'idle' && !isStandaloneNoParent && (
        <>
          {/* Top bar */}
          <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">
                SISO Design System — Pick a component
              </span>
              {caller && (
                <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
                  {caller}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500">
                session: <code className="text-neutral-600">{shortSession}</code>
              </span>
              <span className="text-xs text-neutral-500">
                {filteredComponents.length}
                {filteredComponents.length < totalMatched
                  ? ` of ${totalMatched}`
                  : ''}{' '}
                matches
              </span>
              <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
                {mode}
              </span>

              {/* Search toggle */}
              <button
                onClick={() => setSearchVisible(v => !v)}
                className="flex items-center gap-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
              >
                <span>Search</span>
                <kbd className="rounded bg-neutral-800 px-1 text-[10px]">⌘K</kbd>
              </button>
            </div>
          </header>

          {/* Search bar */}
          {searchVisible && (
            <div className="border-b border-neutral-800 px-4 py-2">
              <input
                autoFocus
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
          )}

          {/* Grid */}
          <main className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredComponents.map((component, i) => (
                <div
                  key={`${component.source}/${component.name}`}
                  data-grid-index={i}
                >
                  <PickCard
                    component={component}
                    isSelected={isSelected(component)}
                    onPick={handlePick}
                    index={i}
                  />
                </div>
              ))}
            </div>

            {filteredComponents.length === 0 && (
              <div className="py-16 text-center text-neutral-500">
                No components match your search.
              </div>
            )}
          </main>

          {/* Submit bar (multi mode) */}
          {mode === 'multi' && selectedComponents.size > 0 && (
            <div className="sticky bottom-0 flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-4 py-3">
              <span className="text-sm text-neutral-400">
                {selectedComponents.size} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fireCancel('user_closed')}
                  className="rounded border border-neutral-700 bg-neutral-800 px-4 py-1.5 text-sm text-neutral-300 hover:border-neutral-600"
                >
                  Cancel
                </button>
                <button
                  onClick={firePick}
                  className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Confirm selection
                  <kbd className="ml-2 rounded bg-blue-700 px-1 text-[10px]">⌘↵</kbd>
                </button>
              </div>
            </div>
          )}

          {/* Keyboard shortcuts modal */}
          {showShortcuts && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => setShowShortcuts(false)}
            >
              <div
                className="w-80 rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="mb-4 text-base font-semibold text-white">Keyboard shortcuts</h2>
                <div className="space-y-2 text-sm">
                  {[
                    ['↑ ↓ ← →', 'Navigate cards'],
                    ['Enter / Space', 'Pick focused card'],
                    ['1–9', 'Jump to card'],
                    ['⌘K', 'Toggle search'],
                    ['Esc', 'Cancel picker'],
                    ...(mode === 'multi' ? [['⌘↵', 'Submit selection']] : []),
                    ['?', 'Toggle this help'],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex justify-between text-neutral-400">
                      <span>{desc}</span>
                      <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-300">
                        {key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
