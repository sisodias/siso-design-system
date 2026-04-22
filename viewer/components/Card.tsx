'use client'

import { ComponentEntry } from '@/lib/types'
import Link from 'next/link'
import { useCallback, useRef, useState } from 'react'
import SourceBadge from './SourceBadge'

interface Props { component: ComponentEntry }

/**
 * Card component — lazy thumbnail first, iframe on hover/focus.
 *
 * Behavior:
 * - hasThumbnail === true  → renders <img> by default.
 *     On mouseenter (150ms debounce) or focus → mount iframe over the img.
 *     On mouseleave (500ms delay) or blur → unmount iframe.
 * - hasThumbnail === false → renders iframe always (original behavior — no regression).
 * - preview.renderable === false → renders placeholder text (original behavior).
 */
export default function Card({ component }: Props) {
  const href = `/?preview=${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`

  const [iframeVisible, setIframeVisible] = useState(false)
  const mountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (mountTimerRef.current !== null) {
      clearTimeout(mountTimerRef.current)
      mountTimerRef.current = null
    }
    if (unmountTimerRef.current !== null) {
      clearTimeout(unmountTimerRef.current)
      unmountTimerRef.current = null
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    clearTimers()
    mountTimerRef.current = setTimeout(() => {
      setIframeVisible(true)
      mountTimerRef.current = null
    }, 150)
  }, [clearTimers])

  const handleMouseLeave = useCallback(() => {
    clearTimers()
    unmountTimerRef.current = setTimeout(() => {
      setIframeVisible(false)
      unmountTimerRef.current = null
    }, 500)
  }, [clearTimers])

  const handleFocus = useCallback(() => {
    clearTimers()
    setIframeVisible(true)
  }, [clearTimers])

  const handleBlur = useCallback(() => {
    clearTimers()
    unmountTimerRef.current = setTimeout(() => {
      setIframeVisible(false)
      unmountTimerRef.current = null
    }, 500)
  }, [clearTimers])

  const hasThumbnail = Boolean(component.hasThumbnail)
  const isRenderable = component.preview?.renderable !== false
  const useHoverBehavior = hasThumbnail && isRenderable

  const renderPreviewContent = () => {
    if (!isRenderable) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-center p-4">
          <div className="text-neutral-500">
            <div className="text-xs">Code reference</div>
            <div className="mt-1 text-[10px] opacity-60">Open to view source</div>
          </div>
        </div>
      )
    }

    if (!hasThumbnail) {
      return (
        <iframe
          src={`/preview/${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`}
          title={component.displayName}
          className="h-full w-full border-0"
          style={{
            transform: 'scale(var(--preview-scale, 0.5))',
            transformOrigin: 'top left',
            width: 'calc(100% / 0.5)',
            height: 'calc(100% / 0.5)',
          }}
          loading="lazy"
        />
      )
    }

    const thumbnailSrc = component.thumbnail ?? `/thumbnails/${component.source}__${component.name}.png`

    return (
      <>
        <img
          src={thumbnailSrc}
          alt={component.displayName}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ display: iframeVisible ? 'none' : 'block' }}
        />
        {iframeVisible && (
          <iframe
            src={`/preview/${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`}
            title={component.displayName}
            className="absolute inset-0 h-full w-full border-0"
            style={{
              transform: 'scale(var(--preview-scale, 0.5))',
              transformOrigin: 'top left',
              width: 'calc(100% / 0.5)',
              height: 'calc(100% / 0.5)',
            }}
          />
        )}
      </>
    )
  }

  return (
    <Link
      href={href}
      scroll={false}
      className="group block"
      onMouseEnter={useHoverBehavior ? handleMouseEnter : undefined}
      onMouseLeave={useHoverBehavior ? handleMouseLeave : undefined}
      onFocus={useHoverBehavior ? handleFocus : undefined}
      onBlur={useHoverBehavior ? handleBlur : undefined}
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 transition-all duration-200 group-hover:border-neutral-700 isolate"
        style={{
          contain: 'strict',
          ['--preview-scale' as string]: '0.5',
        }}
      >
        {renderPreviewContent()}
        {component.importMode === 'bulk' && (
          <span className="absolute right-2 top-2 rounded-sm bg-neutral-800/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400 backdrop-blur">
            generic
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-neutral-200 group-hover:text-white">
            {component.displayName}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <SourceBadge source={component.source} />
        </div>
      </div>
    </Link>
  )
}
