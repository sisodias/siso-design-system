/**
 * SISO Design System — Adapter Configuration
 *
 * Central configuration point for all external service integrations.
 * Call configureSisoDesign() at your app root to wire up all adapters.
 */

import type { AuthAdapter } from './auth'
import type { CartAdapter } from './cart'
import type { AnalyticsAdapter } from './analytics'
import type {
  ProductContentAdapter,
  BlogContentAdapter,
  PageContentAdapter,
} from './content'
import type { ImageAdapter } from './image'

export interface SisoDesignConfig {
  auth: AuthAdapter
  cart: CartAdapter
  analytics: AnalyticsAdapter
  product: ProductContentAdapter
  blog: BlogContentAdapter
  image: ImageAdapter
}

let currentConfig: SisoDesignConfig | null = null

export function configureSisoDesign(config: SisoDesignConfig): void {
  currentConfig = config
}

export function getSisoConfig(): SisoDesignConfig {
  if (!currentConfig) {
    throw new Error(
      'SISO design system not configured — call configureSisoDesign() at app root'
    )
  }
  return currentConfig
}

// Barrel exports for all adapter types
export type { AuthAdapter, AuthState, AuthUser } from './auth'
export type { CartAdapter, CartState, CartItem } from './cart'
export type { AnalyticsAdapter } from './analytics'
export type {
  ContentAdapter,
  ProductContentAdapter,
  BlogContentAdapter,
  PageContentAdapter,
  Product,
  BlogPost,
  Page,
} from './content'
export type { ImageAdapter, ImageOptions } from './image'

// Default noop exports
export { noopAuth } from './auth'
export { noopCart } from './cart'
export { noopAnalytics } from './analytics'
export { noopImage } from './image'
