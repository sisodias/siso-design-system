/**
 * Analytics Adapter Contract
 *
 * Defines the interface for analytics and event tracking.
 * Works with PostHog, Mixpanel, Plausible, GA4, Segment.
 */

export interface AnalyticsAdapter {
  captureEvent(name: string, props?: Record<string, unknown>): void
  identify(userId: string, traits?: Record<string, unknown>): void
  pageView(path: string): void
}

const isDev = process.env.NODE_ENV === 'development'

/**
 * No-op analytics adapter — logs to console in dev, silent in prod.
 */
export const noopAnalytics: AnalyticsAdapter = {
  captureEvent: (name, props) => {
    if (isDev) console.log('[Analytics]', name, props)
  },
  identify: (userId, traits) => {
    if (isDev) console.log('[Analytics] Identify', userId, traits)
  },
  pageView: (path) => {
    if (isDev) console.log('[Analytics] Page View', path)
  },
}
