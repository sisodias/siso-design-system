/**
 * viewer/lib/pick.ts
 *
 * Pure utility functions for the /pick visual picker.
 * No React imports — these are plain JS helpers.
 */

import type { ComponentEntry } from './types'

// ------------------------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------------------------

export type PickReason = 'user_closed' | 'user_escaped' | 'timeout'

export interface PickComponent {
  source: string
  slug: string
  installUrl: string
  displayName: string
  category: string[]
  visualStyle: string[]
  thumbnail: string | null
}

export interface PickPayload {
  type: 'siso:pick'
  session: string
  mode: string
  components: PickComponent[]
  version: 1
  pickedAt: string
}

export interface CancelPayload {
  type: 'siso:cancel'
  session: string
  reason: PickReason
  version: 1
  cancelledAt: string
}

// ------------------------------------------------------------------------------------------------
// UUID v4 regex
// ------------------------------------------------------------------------------------------------

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// ------------------------------------------------------------------------------------------------
// buildCallbackPayload
// ------------------------------------------------------------------------------------------------

/**
 * Build the canonical pick payload.
 * Maps each ComponentEntry to a flattened component object with an installUrl.
 */
export function buildCallbackPayload(
  components: ComponentEntry[],
  session: string,
  mode: string,
): PickPayload {
  const mapped: PickComponent[] = components.map(c => ({
    source: c.source,
    slug: c.name,
    installUrl: `https://siso-design-system.vercel.app/r/${c.source}/${c.name}.json`,
    displayName: c.displayName,
    category: c.category ?? [],
    visualStyle: c.visualStyle ?? [],
    thumbnail: c.thumbnail ?? null,
  }))

  return {
    type: 'siso:pick',
    session,
    mode,
    components: mapped,
    version: 1,
    pickedAt: new Date().toISOString(),
  }
}

// ------------------------------------------------------------------------------------------------
// buildCancelPayload
// ------------------------------------------------------------------------------------------------

/**
 * Build the canonical cancel payload.
 */
export function buildCancelPayload(
  session: string,
  reason: PickReason,
): CancelPayload {
  return {
    type: 'siso:cancel',
    session,
    reason,
    version: 1,
    cancelledAt: new Date().toISOString(),
  }
}

// ------------------------------------------------------------------------------------------------
// resolveTargetOrigin
// ------------------------------------------------------------------------------------------------

/**
 * Resolve the target origin for postMessage.
 * If callbackUrl is null/empty → return "*" (wildcard, for open pickers).
 * Otherwise parse its origin; on failure return "*".
 */
export function resolveTargetOrigin(callbackUrl: string | null): string {
  if (!callbackUrl || !callbackUrl.trim()) return '*'
  try {
    return new URL(callbackUrl).origin
  } catch {
    return '*'
  }
}

// ------------------------------------------------------------------------------------------------
// encodeRedirectPayload
// ------------------------------------------------------------------------------------------------

/**
 * Encode a payload for redirect via query param.
 * Uses btoa on a UTF-8 JSON string (with proper escaping for unicode).
 */
export function encodeRedirectPayload(payload: object): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
}

// ------------------------------------------------------------------------------------------------
// validateSession
// ------------------------------------------------------------------------------------------------

/**
 * Validate or generate a session ID.
 * If raw is a valid UUID v4 → return it as-is.
 * Otherwise generate a new UUID v4.
 */
export function validateSession(raw: string | null): string {
  if (raw && UUID_V4_RE.test(raw)) return raw
  return crypto.randomUUID()
}
