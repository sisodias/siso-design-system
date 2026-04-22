import type posthogType from 'posthog-js'
import { getOrCreateAnonId, getOrCreateSessionId } from '@/experiments/identity'
import { hasTrackingConsent } from '@/lib/cookieConsent'

type PostHogClient = typeof posthogType
type EventProperties = Record<string, unknown>

const EXP_ASSIGNMENT_PREFIX = 'lumelle_exp_'
const EXP_EXPOSURE_PREFIX = 'lumelle_exp_exposed_'

let posthog: PostHogClient | null = null
let initPromise: Promise<PostHogClient | null> | null = null
const pendingEvents: Array<{ name: string; properties?: EventProperties }> = []

function isBrowser() {
  return typeof window !== 'undefined'
}

function envBool(key: string): boolean {
  try {
    return (import.meta as any).env?.[key] === 'true'
  } catch {
    return false
  }
}

export function analyticsEnabled() {
  return envBool('VITE_ANALYTICS_ENABLED')
}

export function experimentsEnabled() {
  return envBool('VITE_EXPERIMENTS_ENABLED')
}

function posthogConfigured() {
  try {
    return Boolean((import.meta as any).env?.VITE_POSTHOG_KEY)
  } catch {
    return false
  }
}

function getPosthogHost(): string | undefined {
  try {
    const host = (import.meta as any).env?.VITE_POSTHOG_HOST as string | undefined
    return host && host.trim() ? host.trim() : undefined
  } catch {
    return undefined
  }
}

export async function initPosthogOnce(): Promise<void> {
  if (!isBrowser()) return
  if (!hasTrackingConsent()) return
  if (posthog) return

  const shouldInit = posthogConfigured() && (analyticsEnabled() || experimentsEnabled())
  if (!shouldInit) return

  if (!initPromise) {
    initPromise = import('posthog-js')
      .then((mod) => {
        const client = mod.default
        const token = (import.meta as any).env?.VITE_POSTHOG_KEY as string | undefined
        if (!token) return null

        client.init(token, {
          api_host: getPosthogHost(),
          capture_pageview: false,
          capture_pageleave: false,
          autocapture: false,
          rageclick: false,
          disable_session_recording: true,
          disable_surveys: true,
          // Prevent loading extra scripts (recording, surveys, etc.)
          disable_external_dependency_loading: true,
        })

        // Attach Lumelle ids as super-properties (useful for debugging/joins, but keep it non-PII).
        const anonId = getOrCreateAnonId()
        const sessionId = getOrCreateSessionId()
        client.register({
          lumelle_anon_id: anonId,
          lumelle_session_id: sessionId,
        })

        posthog = client
        flushPending()
        return client
      })
      .catch((err) => {
        console.warn('PostHog init failed', err)
        return null
      })
  }

  await initPromise
}

function flushPending() {
  if (!posthog) return
  if (!analyticsEnabled()) {
    pendingEvents.length = 0
    return
  }
  while (pendingEvents.length > 0) {
    const ev = pendingEvents.shift()
    if (!ev) break
    posthog.capture(ev.name, ev.properties)
  }
}

export function getPosthogDistinctId(): string | null {
  try {
    return posthog?.get_distinct_id?.() ?? null
  } catch {
    return null
  }
}

export function captureEvent(name: string, properties?: EventProperties) {
  if (!isBrowser()) return
  if (!analyticsEnabled()) return
  if (!hasTrackingConsent()) return

  const payload = {
    ...getExperimentProperties(),
    ...(properties ?? {}),
  }

  if (posthog) {
    posthog.capture(name, payload)
    return
  }

  pendingEvents.push({ name, properties: payload })
  void initPosthogOnce()
}

export function getFeatureFlagVariant(flagKey: string): boolean | string | undefined {
  // Avoid emitting $feature_flag_called events (free-tier friendly).
  return posthog?.getFeatureFlag?.(flagKey, { send_event: false })
}

export function onFeatureFlags(cb: () => void): (() => void) | null {
  if (!posthog) return null
  return posthog.onFeatureFlags(() => cb())
}

export function rememberExperimentAssignment(experimentKey: string, variant: string) {
  if (!isBrowser()) return
  try {
    sessionStorage.setItem(`${EXP_ASSIGNMENT_PREFIX}${experimentKey}`, variant)
  } catch {
    // ignore
  }
}

export function getRememberedExperimentAssignment(experimentKey: string): string | null {
  if (!isBrowser()) return null
  try {
    return sessionStorage.getItem(`${EXP_ASSIGNMENT_PREFIX}${experimentKey}`)
  } catch {
    return null
  }
}

export function getRememberedExperimentAssignments(): Record<string, string> {
  if (!isBrowser()) return {}
  const out: Record<string, string> = {}
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (!key || !key.startsWith(EXP_ASSIGNMENT_PREFIX)) continue
      const expKey = key.slice(EXP_ASSIGNMENT_PREFIX.length)
      const value = sessionStorage.getItem(key)
      if (expKey && value) out[expKey] = value
    }
  } catch {
    // ignore
  }
  return out
}

export function getExperimentProperties(): Record<string, string> {
  const assignments = getRememberedExperimentAssignments()
  const props: Record<string, string> = {}
  for (const [k, v] of Object.entries(assignments)) {
    props[`exp_${k}`] = v
  }
  return props
}

export function captureExperimentExposure(experimentKey: string, variant: string, properties?: EventProperties) {
  rememberExperimentAssignment(experimentKey, variant)
  if (!isBrowser()) return

  const sessionId = getOrCreateSessionId()
  const marker = `${EXP_EXPOSURE_PREFIX}${sessionId}:${experimentKey}`
  try {
    if (sessionStorage.getItem(marker) === '1') return
    sessionStorage.setItem(marker, '1')
  } catch {
    // if storage is unavailable, fall through and capture (best effort)
  }

  captureEvent('experiment_exposure', {
    experiment_key: experimentKey,
    variant,
    page_path: window.location.pathname,
    ...(properties ?? {}),
  })
}

export function buildCheckoutAttributionAttributes(): Record<string, string> {
  const attrs: Record<string, string> = {}
  if (!hasTrackingConsent()) return attrs
  const anonId = getOrCreateAnonId()
  const sessionId = getOrCreateSessionId()
  attrs.lumelle_anon_id = anonId
  attrs.lumelle_session_id = sessionId

  const phId = getPosthogDistinctId()
  if (phId) attrs.ph_distinct_id = phId

  const assignments = getRememberedExperimentAssignments()
  for (const [key, variant] of Object.entries(assignments)) {
    attrs[`exp_${key}`] = variant
  }

  // Capture Facebook cookies for CAPI attribution
  // These are passed through to Shopify and received in webhooks
  const fbp = document.cookie.match(/_fbp=([^;]+)/)?.[1]
  const fbc = document.cookie.match(/_fbc=([^;]+)/)?.[1]
  if (fbp) attrs.meta_fbp = fbp
  if (fbc) attrs.meta_fbc = fbc

  return attrs
}
