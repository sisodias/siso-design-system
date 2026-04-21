/**
 * Cart Adapter Contract
 *
 * Defines the interface for e-commerce cart integration.
 * Designed to accept Shopify Storefront API, Convex, Stripe, or custom.
 */

export interface CartItem {
  lineId: string
  variantId: string
  title: string
  image?: string
  qty: number
  unitPrice: number
  lineTotal: number
}

export interface CartState {
  items: CartItem[]
  itemCount: number
  subtotal: number
  currency: string
  addItem: (variantId: string, qty?: number) => void
  removeItem: (lineId: string) => void
  updateQty: (lineId: string, qty: number) => void
  checkoutUrl: string | null
  startCheckout: () => void
}

export interface CartAdapter {
  useCart(): CartState
}

/**
 * No-op cart adapter — empty cart, all operations are no-ops.
 */
export const noopCart: CartAdapter = {
  useCart: () => ({
    items: [],
    itemCount: 0,
    subtotal: 0,
    currency: 'USD',
    addItem: () => {},
    removeItem: () => {},
    updateQty: () => {},
    checkoutUrl: null,
    startCheckout: () => {},
  }),
}
