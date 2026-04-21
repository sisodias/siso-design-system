# SISO Design System — Adapter Contracts

The adapter system sits at the top of the 5-tier SISO design pyramid, acting as the **glue layer** that connects the design system to your actual backend services.

## The 5-Tier Pyramid

```
┌─────────────────────────────────┐
│          ADAPTERS               │  ← Glue layer: external services
├─────────────────────────────────┤
│          SYSTEMS                │  ← Full features: auth flows, checkout
├─────────────────────────────────┤
│         COMPOSITES              │  ← Composed patterns: product card, nav
├─────────────────────────────────┤
│         PRIMITIVES               │  ← Base components: Button, Input
├─────────────────────────────────┤
│          TOKENS                 │  ← Foundation: colors, spacing, type
└─────────────────────────────────┘
```

Tokens are the foundation. Adapters are the bridge.

## Wiring Example

Call `configureSisoDesign()` once at your app root:

```ts
// app/layout.tsx
import { configureSisoDesign, noopAuth, noopCart } from '@/design-system/adapters'
import { clerkAuth } from '@/lib/adapters/clerk-auth'
import { shopifyCart } from '@/lib/adapters/shopify-cart'
import { posthogAnalytics } from '@/lib/adapters/posthog'
import { contentfulProducts } from '@/lib/adapters/contentful-products'
import { contentfulBlog } from '@/lib/adapters/contentful-blog'
import { cloudinaryImage } from '@/lib/adapters/cloudinary'

configureSisoDesign({
  auth: clerkAuth,
  cart: shopifyCart,
  analytics: posthogAnalytics,
  product: contentfulProducts,
  blog: contentfulBlog,
  image: cloudinaryImage,
})
```

## Adapter Reference

| Adapter | Purpose |
|---------|---------|
| `auth` | Sign-in state, user profile, sign-in/out actions |
| `cart` | Cart items, quantities, pricing, checkout flow |
| `analytics` | Event capture, user identification, page views |
| `content` | Product, blog, page content by slug or list |
| `image` | CDN URL generation with resize/format opts |

## How to Add a New Adapter

1. Create `adapters/new-feature.ts`
2. Define `NewFeatureAdapter` interface matching the contract pattern
3. Export a noop default implementation
4. Add to `SisoDesignConfig` in `index.ts`
5. Implement your concrete adapter in the app
6. Wire in `configureSisoDesign()` at app root

## How to Wire: Clerk as Auth

```ts
// lib/adapters/clerk-auth.ts
import { useUser } from '@clerk/nextjs'
import type { AuthAdapter, AuthState } from '@/design-system/adapters'

export const clerkAuth: AuthAdapter = {
  useAuth: (): AuthState => {
    const { isSignedIn, user } = useUser()
    return {
      signedIn: isSignedIn,
      user: user ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
        imageUrl: user.imageUrl,
      } : null,
      signIn: () => {/* redirect to sign-in */},
      signOut: () => {/* redirect to sign-out */},
    }
  },
}
```

## How to Wire: Shopify as Cart

```ts
// lib/adapters/shopify-cart.ts
import { useCart } from '@shopify/hydrogen-react'
import type { CartAdapter } from '@/design-system/adapters'

export const shopifyCart: CartAdapter = {
  useCart: () => {
    const cart = useCart()
    return {
      items: cart.lines.map(line => ({
        lineId: line.id,
        variantId: line.merchandise.id,
        title: line.merchandise.title,
        image: line.merchandise.image?.url,
        qty: line.quantity,
        unitPrice: line.merchandise.price.amount,
        lineTotal: line.cost.totalAmount.amount,
      })),
      itemCount: cart.totalQuantity,
      subtotal: cart.cost.subtotalAmount.amount,
      currency: cart.cost.subtotalAmount.currencyCode,
      addItem: (variantId, qty = 1) => cart.addLines({ lines: [{ merchandiseId: variantId, quantity: qty }] }),
      removeItem: (lineId) => cart.removeLines([lineId]),
      updateQty: (lineId, qty) => cart.updateLines({ lines: [{ id: lineId, quantity: qty }] }),
      checkoutUrl: cart.checkoutUrl,
      startCheckout: () => { if (cart.checkoutUrl) window.location.href = cart.checkoutUrl },
    }
  },
}
```

## How to Wire: Supabase as Content

```ts
// lib/adapters/supabase-content.ts
import { supabase } from '@/lib/supabase'
import type { ProductContentAdapter, Product } from '@/design-system/adapters'

export const supabaseProducts: ProductContentAdapter = {
  getBySlug: async (slug: string): Promise<Product | null> => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    return data
  },
  list: async (filter = {}): Promise<Product[]> => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    return data ?? []
  },
}
```

## Noop Defaults

Every adapter ships with a noop implementation:

| Adapter | Noop |
|---------|------|
| `auth` | `noopAuth` — signedOut, null user |
| `cart` | `noopCart` — empty cart, no-op actions |
| `analytics` | `noopAnalytics` — console.log in dev, silent in prod |
| `content` | `noopContent` — null / empty array |
| `image` | `noopImage` — identity pass-through |

Use noops for local dev or when a service is not yet wired. The system gracefully degrades.
