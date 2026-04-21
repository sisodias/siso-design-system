export type CheckoutHandoffCapabilities = {
  routes: string[]
}

export type CheckoutCapabilities = {
  mode: 'redirect' | 'embedded' | 'none'
  providerLabel?: string

  supportsDiscounts: boolean
  supportsBuyerIdentity: boolean

  handoff?: CheckoutHandoffCapabilities
}

export type CheckoutStart =
  | { mode: 'redirect'; url: string }
  | { mode: 'embedded'; sessionToken: string }
  | { mode: 'none'; reason: string }

export interface CheckoutPort {
  getCapabilities(): CheckoutCapabilities
  beginCheckout(): Promise<CheckoutStart>
}
