# Lumelle Menu/Cart Drawer System

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

Preserved as-is from luminelle-partnership (private conductor workspace) for design reference.

## Source App
luminelle-partnership

## Source Paths
- `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/providers/DrawerProvider.tsx`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/providers/DrawerContext.tsx`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/client/shop/cart/providers/CartContext.tsx`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/client/shop/cart/logic/volumeDiscounts.ts`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/config/constants.ts`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/lib/analytics/posthog.ts`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/client/shop/products/data/product-config.ts`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/client/shop/products/data/product-types.ts`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/platform/commerce/ports/cart.ts`
- `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/platform/commerce/ports/checkout.ts`

## What This Is
Mobile-first side drawer with a Menu/Cart tab toggle at the top. The Menu tab shows a PRODUCTS rail (3 product cards with "BEST SELLER"/"NEW" pill badges, rounded thumbnails, titles, and subtitles) and a MORE section (Creators/Brand story/Blog with Lucide icons + 2-line descriptions). A sign-in footer card with a peach/coral "Continue to sign in" CTA appears at the bottom. The Cart tab shows line items with quantity dropdowns (portal-rendered), star ratings, volume discount tier badges, upsell cards, free-shipping progress bar, subtotal, savings, and a Shopify checkout handoff button. The drawer is portal-mounted, animates via CSS transform (translate3d), locks scroll, uses inert-attribute accessibility, and traps focus.

## Files
| File | Lines | Purpose |
|------|-------|---------|
| `DrawerProvider.tsx` | 952 | Full drawer UI (Menu + Cart panels, portal, CSS transforms, inert/focus-trap, scroll-lock, qty dropdown portal, analytics) |
| `DrawerContext.tsx` | 13 | DrawerApi context type + useDrawer hook |
| `CartContext.tsx` | 562 | Cart state engine (items, add/remove/update, localStorage persistence, Shopify port sync, volume discount auto-apply, checkout URL) |
| `volumeDiscounts.ts` | 36 | Volume discount tier logic (SHOWER_CAP_TIERS, getVolumeDiscountTierForVariant) |
| `constants.ts` | 57 | App-wide constants including FREE_SHIPPING_THRESHOLD_GBP (20) and MAX_CART_ITEM_QTY (4) |
| `posthog.ts` | 239 | PostHog analytics helper (init, captureEvent, buildCheckoutAttributionAttributes, experiment tracking) |
| `product-types.ts` | 59 | ProductConfig TypeScript type definition |
| `product-config.ts` | 731 | Full product catalog config (gallery arrays, TikTok embeds, essentials/reasons/qa/how/care copy, price, variants) |
| `cart.ts` | 48 | Commerce port types: CartDTO, CartLineDTO, CartDraftDTO, CartPort interface |
| `checkout.ts` | 24 | Checkout port types: CheckoutCapabilities, CheckoutStart, CheckoutPort interface |

## Dependencies
- `react`, `react-dom` (createPortal)
- `react-router-dom` (Link as RouterLink, useLocation)
- `lucide-react` (UserRound, Users, BookOpen, Newspaper icons)
- `@clerk/clerk-react` or `@platform/auth` (useAuthContext — signedIn, user, user.avatarUrl)
- `posthog-js` (analytics)
- `@platform/commerce` (commerce.checkout, commerce.cart)
- `@platform/ports` (PortError, CartKey, CartLineKey, VariantKey, MoneyDTO)
- `@/utils/env` (used by volumeDiscounts.ts)

## Known Broken Imports (when isolated)
These aliases must be resolved for the code to type-check:

| Import | Source |
|--------|--------|
| `from '@/config/constants'` | `src/config/constants.ts` |
| `from '@/lib/analytics/posthog'` | `src/lib/analytics/posthog.ts` |
| `from '@/experiments/identity'` | not copied (stub: `getOrCreateAnonId`, `getOrCreateSessionId`) |
| `from '@/lib/cookieConsent'` | not copied (stub: `hasTrackingConsent`) |
| `from '@/utils/env'` | not copied (stub: `env()`) |
| `from '@client/shop/cart/logic/volumeDiscounts'` | `src/domains/client/shop/cart/logic/volumeDiscounts.ts` |
| `from '@client/shop/cart/providers/CartContext'` | `src/domains/client/shop/cart/providers/CartContext.tsx` |
| `from '@platform/commerce'` | not copied (provides `commerce.checkout`, `commerce.cart`) |
| `from '@platform/commerce/ports'` | `src/domains/platform/commerce/ports/cart.ts`, `checkout.ts` |
| `from '@platform/auth/providers/AuthContext'` | not copied (stub: `useAuthContext` → { signedIn, user }) |
| `from '@platform/ports'` | not copied (provides CartKey, VariantKey, MoneyDTO, PortError) |

## How to Use as Reference
Preserved as-is. To wire into a new app:
1. Resolve all `@/` and `@client/`/`@platform/` aliases to relative imports
2. Provide an auth context or stub `useAuth` returning `{ signedIn, user }`
3. Provide or stub `commerce` object with `cart` (getCart, addLine, updateLine, removeLine, applyDiscount, syncFromDraft) and `checkout` (getCapabilities, beginCheckout)
4. Wire product data to your product catalog source
5. Stub `captureEvent`, `initPosthogOnce`, `buildCheckoutAttributionAttributes` (or replace with your analytics provider)
6. Stub `env()`, `hasTrackingConsent()`, `getOrCreateAnonId()`, `getOrCreateSessionId()` — or wire them to real implementations

## Screenshot Reference
- **Header:** Menu/Cart tab toggle at top (active tab = peach/blush fill), X close button top-right
- **Background:** Semi-transparent black overlay (`bg-black/20`)
- **Products rail:** White rounded cards, 96x96 rounded thumbnail, pill badge (blush/BEST SELLER or coral/NEW), title + subtitle
- **More section:** Icon + 2-line text rows (Users, BookOpen, Newspaper Lucide icons)
- **Sign-in footer:** White card with UserRound icon, peach CTA button ("Continue to sign in")
- **Cart:** Line items with star ratings, qty dropdown (portal), upsell "Add" buttons, sticky subtotal + checkout button (dark cocoa fill)
