'use client'

import { useCallback, useRef, useState } from 'react'
import type { ComponentEntry } from '@/lib/types'

interface Props {
  component: ComponentEntry
  isSelected: boolean
  onPick: (component: ComponentEntry) => void
  index: number
}

/**
 * PickCard — visual picker card with hover iframe debounce (mirrors Card.tsx pattern).
 *
 * Dimensions: aspect-[4/3], min-h-[200px] (larger than Card.tsx)
 *
 * Behavior:
 * - hasThumbnail === true  → <img> by default, <iframe> on hover (150ms debounce)
 * - hasThumbnail === false && isRenderable → always show <iframe>
 * - !isRenderable → placeholder div
 */
export default function PickCard({ component, isSelected, onPick, index }: Props) {
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

  const previewSrc = `/preview/${encodeURIComponent(component.source)}/${encodeURIComponent(component.name)}`

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
          src={previewSrc}
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

    const thumbnailSrc =
      component.thumbnail ??
      `/thumbnails/${component.source}__${component.name}.png`

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
            src={previewSrc}
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

  const handleClick = useCallback(() => {
    onPick(component)
  }, [component, onPick])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onPick(component)
      }
    },
    [component, onPick],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={useHoverBehavior ? handleMouseEnter : undefined}
      onMouseLeave={useHoverBehavior ? handleMouseLeave : undefined}
      onFocus={useHoverBehavior ? handleFocus : undefined}
      onBlur={useHoverBehavior ? handleBlur : undefined}
      data-index={index}
      className="group flex cursor-pointer flex-col"
    >
      {/* Preview area */}
      <div
        className={[
          'relative min-h-[200px] w-full overflow-hidden rounded-xl border bg-neutral-950 transition-all duration-200 isolate',
          isSelected
            ? 'ring-2 ring-blue-500 border-blue-500'
            : 'border-neutral-800 group-hover:border-neutral-700',
        ]
          .join(' ')
          .trim()}
        style={{
          contain: 'strict',
          ['--preview-scale' as string]: '0.5',
          aspectRatio: '4 / 3',
        }}
      >
        {renderPreviewContent()}

        {/* Selected checkmark badge */}
        {isSelected && (
          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5L4.5 7.5L8 3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 flex flex-col gap-1 px-1">
        <div className="truncate text-sm font-medium text-neutral-200 group-hover:text-white">
          {component.displayName}
        </div>

        {component.aiSummary && (
          <div className="line-clamp-2 text-xs text-neutral-400">
            {component.aiSummary}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1">
          {component.category && component.category.length > 0 && (
            <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              {component.category[0]}
            </span>
          )}

          {component.visualStyle &&
            component.visualStyle.map(style => (
              <span
                key={style}
                className="rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-500"
              >
                {style}
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}
