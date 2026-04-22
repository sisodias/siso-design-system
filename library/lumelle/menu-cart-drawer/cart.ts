import type { CartKey, CartLineKey, MoneyDTO, VariantKey } from '@platform/ports'

export type CartDraftDTO = {
  lines: Array<{ variantKey: VariantKey; qty: number }>
  discountCode?: string
  buyerEmail?: string
  attributes?: Record<string, string>
}

export type CartLineDTO = {
  lineKey: CartLineKey
  variantKey: VariantKey

  title: string
  productTitle?: string
  variantTitle?: string

  qty: number

  unitPrice: MoneyDTO
  compareAt?: MoneyDTO
  image?: string

  lineSubtotal?: MoneyDTO
}

export type CartDTO = {
  cartKey: CartKey
  lines: CartLineDTO[]
  subtotal: MoneyDTO
  currencyCode?: string
  discountCodes?: string[]
}

export interface CartPort {
  getCart(): Promise<CartDTO>

  syncFromDraft?(draft: CartDraftDTO): Promise<CartDTO>

  addLine(input: { variantKey: VariantKey; qty: number }): Promise<CartDTO>
  updateLine(input: { lineKey: CartLineKey; qty: number }): Promise<CartDTO>
  removeLine(input: { lineKey: CartLineKey }): Promise<CartDTO>

  applyDiscount?(code: string): Promise<CartDTO>
  setBuyerIdentity?(input: { email?: string }): Promise<CartDTO>
  setAttributes?(attrs: Record<string, string>): Promise<CartDTO>
}
