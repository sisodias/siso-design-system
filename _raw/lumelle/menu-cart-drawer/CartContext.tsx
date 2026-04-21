import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { MAX_CART_ITEM_QTY } from '@/config/constants'
import { getVolumeDiscountCodes, getVolumeDiscountTierForVariant, type VolumeDiscountTier } from '@client/shop/cart/logic/volumeDiscounts'
import { commerce } from '@platform/commerce'
import { PortError } from '@platform/ports'
import type { CartDTO, CartLineDTO, CheckoutCapabilities, CheckoutStart } from '@platform/commerce/ports'

/**
 * Maps product handles to their primary product page image.
 * These must match the first image in the gallery config for each product.
 *
 * See src/domains/client/shop/products/data/product-config.ts for the source of truth.
 */
const PRODUCT_PAGE_IMAGES: Record<string, string> = {
  // Shower cap: /uploads/luminele/shower-cap-01.webp (first image in CAP_GALLERY)
  'lumelle-shower-cap': '/uploads/luminele/shower-cap-01.webp',

  // Overnight curler: /uploads/curler/1.webp (first image in curlerGallery)
  'satin-overnight-curler': '/uploads/curler/1.webp',
}

/**
 * Normalizes cart item images to match the first image shown on product pages.
 */
const normalizeCartImage = (variantKey: string, fallbackImage?: string): string | undefined => {
  // Extract handle from variant key (format: variant.{handle}.{variant})
  const match = variantKey.match(/^variant\.([\w-]+)\./)
  if (!match) return fallbackImage

  const handle = match[1]
  // Map the handle to the product page primary image
  return PRODUCT_PAGE_IMAGES[handle] ?? fallbackImage
}

export type CartItem = {
  id: string
  title: string
  price: number
  displayPrice?: number
  compareAt?: number
  displayCompareAt?: number
  qty: number
  lineId?: string
  image?: string
  rating?: number
  reviewsCount?: number
}

type CartState = {
  items: CartItem[]
  discountCode?: string | null
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => Promise<void>
  setQty: (id: string, qty: number) => Promise<void>
  remove: (id: string) => Promise<void>
  clear: () => Promise<void>
  subtotal: number
  qty: number
  checkoutUrl?: string
  checkoutLoading?: boolean
  checkoutCapabilities?: CheckoutCapabilities
  checkoutStart?: CheckoutStart
  refreshCheckout?: () => Promise<void>
  setEmail?: (email: string) => Promise<void>
  setAttributes?: (attrs: Record<string, string>) => Promise<void>
  applyDiscount?: (code: string) => void
}

const STORAGE_KEY = 'lumelle_cart'
const DISCOUNT_KEY = 'lumelle_cart_discount_code'
const PENDING_DISCOUNT_KEY = 'lumelle_pending_discount_code'
const CartCtx = createContext<CartState | null>(null)

const persist = (items: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

const persistDiscount = (code: string | null) => {
  try {
    if (!code) {
      localStorage.removeItem(DISCOUNT_KEY)
      return
    }
    localStorage.setItem(DISCOUNT_KEY, code)
  } catch {
    /* ignore */
  }
}

const toNumber = (value: unknown): number => {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isFinite(n) ? n : 0
}

const clampLineQty = (qty: number): number => {
  const n = Number.isFinite(qty) ? qty : 1
  return Math.max(1, Math.min(MAX_CART_ITEM_QTY, Math.floor(n)))
}

const mapCartLineToItem = (line: CartLineDTO): CartItem => {
  const unitPrice = toNumber(line.unitPrice.amount)
  const compareAt = line.compareAt ? toNumber(line.compareAt.amount) : undefined
  const title = line.productTitle ?? line.title ?? 'Item'

  return {
    id: line.variantKey,
    lineId: line.lineKey,
    title,
    price: unitPrice,
    compareAt,
    qty: clampLineQty(line.qty),
    // Normalize cart image to match the first image shown on product pages
    image: normalizeCartImage(line.variantKey, line.image),
  }
}

const mapCartToItems = (cart: CartDTO): CartItem[] => {
  return (cart.lines ?? []).map(mapCartLineToItem)
}

const isLegacyShopifyGid = (id: string) => id.startsWith('gid://shopify/')

const withCheckoutDiscountCode = (url: string | undefined, code: string | null | undefined): string | undefined => {
  if (!url) return undefined
  const normalized = String(code ?? '').trim().toUpperCase()
  if (!normalized) return url

  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
    const parsed = new URL(url, base)
    parsed.searchParams.set('discount', normalized)
    return parsed.toString()
  } catch {
    // If URL parsing fails (unexpected provider URL format), fall back to the raw URL.
    return url
  }
}

const clearLegacyShopifyCartId = () => {
  try {
    localStorage.removeItem('lumelle_shopify_cart_id')
  } catch {
    // ignore
  }
}

const CartProviderBase: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const checkoutCapabilities = useMemo(() => commerce.checkout.getCapabilities(), [])
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as CartItem[]) : []
      return Array.isArray(parsed)
        ? parsed
            .filter((item) => item && typeof item === 'object' && 'id' in item)
            .map((item) => ({ ...item, qty: clampLineQty(toNumber((item as any).qty)) }))
        : []
    } catch {
      return []
    }
  })

  const [discountCode, setDiscountCode] = useState<string | null>(() => {
    try {
      const normalize = (code: unknown) => String(code ?? '').trim().toUpperCase()

      const raw = localStorage.getItem(DISCOUNT_KEY)
      if (raw) {
        try {
          localStorage.removeItem(PENDING_DISCOUNT_KEY)
        } catch {
          // ignore
        }
        return normalize(raw)
      }

      const pending = localStorage.getItem(PENDING_DISCOUNT_KEY)
      if (pending) {
        try {
          localStorage.removeItem(PENDING_DISCOUNT_KEY)
        } catch {
          // ignore
        }
        return normalize(pending)
      }

      return null
    } catch {
      return null
    }
  })

  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined)
  const [checkoutStart, setCheckoutStart] = useState<CheckoutStart | undefined>(undefined)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const checkoutUrlWithDiscount = useMemo(() => {
    return withCheckoutDiscountCode(checkoutUrl, discountCode)
  }, [checkoutUrl, discountCode])

  const itemsRef = useRef<CartItem[]>(items)
  const discountCodeRef = useRef<string | null>(discountCode)
  const queueRef = useRef<Promise<void>>(Promise.resolve())
  const volumeDiscountCodes = useMemo(() => getVolumeDiscountCodes(), [])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    discountCodeRef.current = discountCode
  }, [discountCode])

  useEffect(() => {
    persist(items)
  }, [items])

  useEffect(() => {
    persistDiscount(discountCode)
  }, [discountCode])

  const enqueue = useCallback((op: () => Promise<void>) => {
    queueRef.current = queueRef.current
      .then(op)
      .catch((err) => {
        // In development, suppress errors when backend isn't available
        const isDevelopment = import.meta.env.DEV
        const isBackendUnavailable = err instanceof PortError && err.code === 'NOT_CONFIGURED'
        if (!isDevelopment || !isBackendUnavailable) {
          console.error('Cart sync failed:', err)
        }
      })
    return queueRef.current
  }, [])

  const toCheckoutUnavailableReason = useCallback((err: unknown): string => {
    if (err instanceof PortError) {
      if (err.code === 'NOT_FOUND') return 'No cart found. Please retry.'
      if (err.code === 'NOT_CONFIGURED') return 'Checkout is temporarily unavailable.'
      if (err.code === 'UNAVAILABLE') return 'Checkout is temporarily unavailable. Please retry.'
      return 'Checkout is temporarily unavailable.'
    }
    return 'Checkout is temporarily unavailable. Please retry.'
  }, [])

  const syncCheckoutUrl = useCallback(async () => {
    setCheckoutLoading(true)
    try {
      const start = await commerce.checkout.beginCheckout()
      setCheckoutStart(start)
      if (start.mode === 'redirect') {
        setCheckoutUrl(start.url)
        return
      }
      setCheckoutUrl(undefined)
    } catch (err) {
      console.warn('Failed to compute checkout URL:', err)
      setCheckoutStart({ mode: 'none', reason: toCheckoutUnavailableReason(err) })
      setCheckoutUrl(undefined)
    } finally {
      setCheckoutLoading(false)
    }
  }, [toCheckoutUnavailableReason])

  const setFromCart = useCallback(
    async (cart: CartDTO) => {
      setItems(mapCartToItems(cart))

      if ((cart.lines ?? []).length > 0) {
        await syncCheckoutUrl()
      } else {
        setCheckoutStart(undefined)
        setCheckoutUrl(undefined)
      }
    },
    [syncCheckoutUrl]
  )

  const getDesiredVolumeDiscountTier = useCallback((nextItems: CartItem[]): VolumeDiscountTier | null => {
    let best: VolumeDiscountTier | null = null
    for (const item of nextItems) {
      const tier = getVolumeDiscountTierForVariant(item.id, item.qty)
      if (!tier) continue
      if (!best || tier.minQty > best.minQty) best = tier
    }
    return best
  }, [])

  const syncVolumeDiscountFromItems = useCallback(
    (nextItems: CartItem[]) => {
      const current = discountCodeRef.current ? discountCodeRef.current.toUpperCase() : null
      const currentIsVolume = current ? volumeDiscountCodes.has(current) : false

      const desiredTier = getDesiredVolumeDiscountTier(nextItems)
      const desired = desiredTier?.code ?? null
      const shouldManage = currentIsVolume || (!current && Boolean(desired))

      if (!shouldManage) {
        return { managed: false as const, code: current }
      }
      if (desired === current) {
        return { managed: true as const, code: current }
      }

      discountCodeRef.current = desired
      setDiscountCode(desired)
      return { managed: true as const, code: desired }
    },
    [getDesiredVolumeDiscountTier, volumeDiscountCodes]
  )

  const applyDiscountToBackendIfSupported = useCallback(async (code: string | null) => {
    if (!commerce.cart.applyDiscount) {
      return
    }
    try {
      const cart = await commerce.cart.applyDiscount(code ?? '')
      await setFromCart(cart)
    } catch (err) {
      console.error('Failed to apply discount code to cart:', err)
    }
  }, [setFromCart])

  // Rehydrate cart from provider (and optionally create it from local draft).
  useEffect(() => {
    clearLegacyShopifyCartId()

    void enqueue(async () => {
      // Filter out legacy Shopify GIDs (pre-ports) to avoid feeding undecodable IDs into ports.
      const seedItems = itemsRef.current
      const compatibleSeed = seedItems.filter((i) => !isLegacyShopifyGid(i.id))
      if (compatibleSeed.length !== seedItems.length) {
        itemsRef.current = compatibleSeed
        setItems(compatibleSeed)
      }

      let cart = await commerce.cart.getCart()

      if ((cart.lines ?? []).length === 0 && compatibleSeed.length > 0 && commerce.cart.syncFromDraft) {
        try {
          cart = await commerce.cart.syncFromDraft({
            lines: compatibleSeed.map((i) => ({ variantKey: i.id, qty: clampLineQty(i.qty) })),
            discountCode: discountCodeRef.current ?? undefined,
          })
        } catch (err) {
          console.warn('Failed to seed cart from local draft:', err)
        }
      }

      // Ensure we keep our volume-discount logic consistent with the loaded cart.
      const nextItems = mapCartToItems(cart)
      const { managed, code } = syncVolumeDiscountFromItems(nextItems)

      // Keep the provider cart in sync with our tiered discount policy so checkout reflects it.
      if (managed && commerce.cart.applyDiscount) {
        try {
          cart = await commerce.cart.applyDiscount(code ?? '')
        } catch (err) {
          console.warn('Failed to apply volume discount during cart rehydrate:', err)
        }
      }

      await setFromCart(cart)
    })
  }, [enqueue, setFromCart, syncVolumeDiscountFromItems])

  const add: CartState['add'] = async (item, qty = 1) => {
    const safeQty = clampLineQty(qty)
    const prev = itemsRef.current
    const existing = prev.find((p) => p.id === item.id)
    const nextQty = existing ? clampLineQty(existing.qty + safeQty) : safeQty
    if (existing && nextQty === existing.qty) {
      return
    }

    const nextItems = existing
      ? prev.map((p) => (p.id === item.id ? { ...p, qty: nextQty } : p))
      : [...prev, { ...item, qty: safeQty }]

    itemsRef.current = nextItems
    setItems(nextItems)
    const { managed, code } = syncVolumeDiscountFromItems(nextItems)

    await enqueue(async () => {
      const localLineKey = itemsRef.current.find((i) => i.id === item.id)?.lineId
      let cart: CartDTO

      if (localLineKey) {
        cart = await commerce.cart.updateLine({ lineKey: localLineKey, qty: nextQty })
      } else {
        cart = await commerce.cart.addLine({ variantKey: item.id, qty: existing ? safeQty : nextQty })
      }

      await setFromCart(cart)
      if (managed) {
        await applyDiscountToBackendIfSupported(code)
      }
    })
  }

  const setQty: CartState['setQty'] = async (id, qty) => {
    if (qty <= 0) return remove(id)
    const clampedQty = clampLineQty(qty)
    const prev = itemsRef.current
    const nextItems = prev.map((p) => (p.id === id ? { ...p, qty: clampedQty } : p))
    itemsRef.current = nextItems
    setItems(nextItems)
    const { managed, code } = syncVolumeDiscountFromItems(nextItems)

    await enqueue(async () => {
      const localLineKey = itemsRef.current.find((i) => i.id === id)?.lineId
      if (localLineKey) {
        const cart = await commerce.cart.updateLine({ lineKey: localLineKey, qty: clampedQty })
        await setFromCart(cart)
        if (managed) await applyDiscountToBackendIfSupported(code)
        return
      }

      // If we don't have a line key (legacy/local), try to resolve it by fetching the cart.
      const cart = await commerce.cart.getCart()
      const line = (cart.lines ?? []).find((l) => l.variantKey === id)
      if (!line) return
      const next = await commerce.cart.updateLine({ lineKey: line.lineKey, qty: clampedQty })
      await setFromCart(next)
      if (managed) await applyDiscountToBackendIfSupported(code)
    })
  }

  const remove: CartState['remove'] = async (id) => {
    const prev = itemsRef.current
    const nextItems = prev.filter((p) => p.id !== id)
    itemsRef.current = nextItems
    setItems(nextItems)
    const { managed, code } = syncVolumeDiscountFromItems(nextItems)

    await enqueue(async () => {
      const localLineKey = itemsRef.current.find((i) => i.id === id)?.lineId
      if (localLineKey) {
        const cart = await commerce.cart.removeLine({ lineKey: localLineKey })
        await setFromCart(cart)
        if (managed) await applyDiscountToBackendIfSupported(code)
        return
      }

      const cart = await commerce.cart.getCart()
      const line = (cart.lines ?? []).find((l) => l.variantKey === id)
      if (!line) return
      const next = await commerce.cart.removeLine({ lineKey: line.lineKey })
      await setFromCart(next)
      if (managed) await applyDiscountToBackendIfSupported(code)
    })
  }

  const clear: CartState['clear'] = async () => {
    setItems([])
    setCheckoutUrl(undefined)
    setCheckoutStart(undefined)
    setDiscountCode(null)
    itemsRef.current = []

    await enqueue(async () => {
      try {
        const cart = await commerce.cart.getCart()
        for (const line of cart.lines ?? []) {
          await commerce.cart.removeLine({ lineKey: line.lineKey })
        }
      } catch (err) {
        console.warn('Failed to clear cart:', err)
      }
    })
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.displayPrice ?? item.price) * item.qty, 0),
    [items]
  )
  const qty = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items])

  const applyDiscount: CartState['applyDiscount'] = (code) => {
    const trimmed = (code ?? '').trim()
    if (!trimmed) {
      setDiscountCode(null)
      void enqueue(async () => {
        await applyDiscountToBackendIfSupported(null)
      })
      return
    }
    setDiscountCode(trimmed.toUpperCase())

    void enqueue(async () => {
      await applyDiscountToBackendIfSupported(trimmed.toUpperCase())
    })
  }

  const setEmail: CartState['setEmail'] = async (email) => {
    if (!commerce.cart.setBuyerIdentity) return
    await enqueue(async () => {
      try {
        const cart = await commerce.cart.setBuyerIdentity!({ email })
        await setFromCart(cart)
      } catch (err) {
        console.warn('Failed to set buyer email:', err)
      }
    })
  }

  const setAttributes: CartState['setAttributes'] = async (attrs) => {
    if (!commerce.cart.setAttributes) return
    await enqueue(async () => {
      try {
        const cart = await commerce.cart.setAttributes!(attrs)
        await setFromCart(cart)
      } catch (err) {
        console.warn('Failed to set cart attributes:', err)
      }
    })
  }

  const refreshCheckout: CartState['refreshCheckout'] = async () => {
    if (itemsRef.current.length === 0) {
      setCheckoutStart(undefined)
      setCheckoutUrl(undefined)
      return
    }
    await enqueue(async () => {
      await syncCheckoutUrl()
    })
  }

  const value: CartState = {
    items,
    discountCode,
    add,
    setQty,
    remove,
    clear,
    subtotal,
    qty,
    checkoutUrl: checkoutUrlWithDiscount,
    checkoutLoading,
    checkoutCapabilities,
    checkoutStart,
    refreshCheckout,
    setEmail,
    setAttributes,
    applyDiscount,
  }

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}

export const CartProvider = CartProviderBase
export const useCart = () => {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default CartProvider
