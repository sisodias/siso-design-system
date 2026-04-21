import { useEffect, useState } from 'react'
import { getFeatureFlagVariant, getRememberedExperimentAssignment, initPosthogOnce, onFeatureFlags, rememberExperimentAssignment } from './posthog'

function normalizeVariant(value: boolean | string | undefined, fallback: string): string {
  if (typeof value === 'string' && value) return value
  if (value === true) return 'on'
  if (value === false) return 'off'
  return fallback
}

/**
 * Reads a PostHog feature flag (supports multivariate variants) without sending $feature_flag_called events.
 * Keeps a best-effort per-session cache (sessionStorage) to reduce flicker and make checkout attribution reliable.
 */
export function useFeatureFlagVariant(flagKey: string, fallback = 'control') {
  const [variant, setVariant] = useState(() => getRememberedExperimentAssignment(flagKey) ?? fallback)

  useEffect(() => {
    let unsub: (() => void) | null = null
    let cancelled = false

    const sync = () => {
      if (cancelled) return
      const next = normalizeVariant(getFeatureFlagVariant(flagKey), fallback)
      setVariant(next)
      rememberExperimentAssignment(flagKey, next)
    }

    void initPosthogOnce().then(() => {
      if (cancelled) return
      sync()
      unsub = onFeatureFlags(sync)
    })

    return () => {
      cancelled = true
      unsub?.()
    }
  }, [flagKey, fallback])

  return variant
}
