import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type AnnouncementBarProps = {
  message: string
  severity?: 'info' | 'warn' | 'error'
  ctaLabel?: string
  ctaHref?: string
  dismissible?: boolean
}

const severityBg: Record<NonNullable<AnnouncementBarProps['severity']>, string> = {
  info: '#eef6ff',
  warn: '#fff4e5',
  error: '#ffe9e6',
}

export function AnnouncementBar({
  message,
  severity = 'info',
  ctaLabel,
  ctaHref,
  dismissible,
}: AnnouncementBarProps) {
  const bg = severityBg[severity] ?? severityBg.info
  const normalizedCtaHref = (ctaHref ?? '').trim()
  const normalizedCtaLabel = (ctaLabel ?? '').trim()
  const hasCta = Boolean(normalizedCtaLabel) && Boolean(normalizedCtaHref) && normalizedCtaHref !== '#'

  const dismissStorageKey = useMemo(() => `lumelle:announcement:dismissed:${message}`, [message])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!dismissible) return
    try {
      setDismissed(window.localStorage.getItem(dismissStorageKey) === '1')
    } catch {
      // noop
    }
  }, [dismissStorageKey, dismissible])

  const handleDismiss = () => {
    setDismissed(true)
    try {
      window.localStorage.setItem(dismissStorageKey, '1')
    } catch {
      // noop
    }
  }

  if (dismissible && dismissed) return null

  return (
    <div className="w-full" style={{ background: bg }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 text-sm font-semibold text-semantic-text-primary">
        <span>{message}</span>
        <div className="flex items-center gap-2">
          {hasCta ? (
            normalizedCtaHref.startsWith('/') ? (
              <Link
                to={normalizedCtaHref}
                className="text-sm font-semibold text-semantic-legacy-brand-cocoa underline underline-offset-4"
              >
                {normalizedCtaLabel}
              </Link>
            ) : (
              <a
                href={normalizedCtaHref}
                className="text-sm font-semibold text-semantic-legacy-brand-cocoa underline underline-offset-4"
              >
                {normalizedCtaLabel}
              </a>
            )
          ) : null}
          {dismissible ? (
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-base font-semibold text-semantic-text-primary/70 transition hover:bg-black/5"
              aria-label="Dismiss announcement"
            >
              ×
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBar
