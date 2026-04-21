# Lumelle Product Detail Page — Hero Section

**Source:** `luminelle-partnership / shop/products/ui/pages/ProductPage/` + supporting sections

**What this is:** Complete mobile PDP hero section — everything from the top announcement pill down through the purchase buttons. Shaan specifically flagged: "I love the top hero section all the way up to the Buy Now." Preserved as-is for reference.

---

## Visual Anatomy (top to bottom)

1. **Top announcement pill** — rounded white pill with pulsing dot + "NEW HEATLESS CURLER LAUNCHED →" (from HeroMedia `showLaunchBanner` link)
2. **Hero image carousel** — full-width rounded image with prev/next arrows, "1/9" counter pill top-right, tap-to-zoom modal, swipeable
3. **Thumbnail strip** — 4 small rounded thumbnails below hero, active one has cocoa border + ring
4. **Product title** — Playfair serif heading "Lumelle Shower Cap"
5. **Subtitle/content line** — product description hook
6. **Rating + free returns row** — star rating + "4.8 (100+)" + vertical divider + check icon + "Free returns"
7. **Pull-quote review card** — peach-blush panel, 5-star row, italic-serif quote, "— Amelia, verified buyer" attribution
8. **Price block** — large price "£24.95" + red "Save 25%" pill + strikethrough RRP
9. **Trust chip row** — "Selling fast" (pulsing cocoa dot) + truck icon "Free shipping"
10. **Dispatch line** — "Dispatch target: 48h · Free 30-day returns"
11. **Quantity stepper** — minus/plus pill with qty + live unit-price below
12. **Add to Cart button** — cocoa fill primary CTA with shadow lift on hover
13. **Buy Now button** — peach fill secondary CTA
14. **Secure checkout trust row** — shield icon "Secure checkout" + circle-check "30-day guarantee"
15. **Payment logos** — VISA · MC · Apple Pay · G Pay in bordered pill tiles
16. **Share button** — top-right circular icon button with copy-to-clipboard fallback

---

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `index.tsx` | 738 | ProductPage wrapper — route params, cart integration, analytics, scrollspy, JSON-LD |
| `HeroMedia.tsx` | 465 | Image carousel — touch swipe, zoom modal, thumbnail strip, prev/next arrows, "1/N" counter |
| `PriceBlock.tsx` | 312 | Price + badges + qty stepper + Add to Cart + Buy Now + trust row + payment logos + share button. Also exports `TrustMicro` |
| `SectionsMap.tsx` | 277 | Section registry + `MobileStickyCta` — composes HeroMedia + PriceBlock + all page sections |
| `FloatingBuyCta.tsx` | 49 | Mobile-only sticky buy bar — fades in after scrolling past hero |
| `HeroProofStrip.tsx` | 203 | Expandable proof strip — count-up rating, 3 customer quotes, Satin/Dispatch/Returns fact cards |
| `useCountUpAnimation.ts` | 61 | IntersectionObserver-powered count-up hook with easeOutQuart |
| `constants.ts` | 8 | `MAX_CART_ITEM_QTY = 4`, `FREE_SHIPPING_THRESHOLD_GBP` |

**Total: 2,113 lines**

---

## Dependencies

- **framer-motion** — used transitively by `ReviewsAutoCarousel` (not in this folder)
- **lucide-react** — icons: `ChevronLeft`, `ChevronRight`, `X`, `ShieldCheck`, `Truck`, `Users`, `CheckCircle`, `ChevronDown`, `ChevronUp`, `Lock`, `CreditCard`, `Shield`, `Quote`, `ShoppingBag`, `Zap`, `X`
- **react-router-dom** — `Link` in HeroMedia, `Navigate`/`useParams`/`useLocation` in index
- **Cloudinary helpers** — `cdnUrl` from `@/utils/cdn` (see below)
- **Clerk auth** — used by `useCart` context
- **Cart context** — `@client/shop/cart/providers/CartContext`

---

## Relationship to Other Keepers

| File | Already Lives In | Note |
|------|-----------------|------|
| `StarRating` | `hero-composition/StarRating.tsx`, `product-spotlight/StarRating.tsx` | NOT duplicated here — reference existing |
| `cdnUrl` helper | `hero-composition/cdn.ts` | NOT duplicated here — same file, use that one |
| `volumeDiscounts` | `menu-cart-drawer/volumeDiscounts.ts` | NOT duplicated — shared with cart drawer |
| `CartContext` | `menu-cart-drawer/CartContext.tsx` | Shared with menu-cart-drawer |
| `useCountUpAnimation` | N/A | NEW — copied here (used by HeroProofStrip) |

---

## Known Broken Imports (when isolated)

These `@/` / `@client/` / `@ui/` / `@platform/` aliases will need rewiring in production:

| Import | Source | Fix |
|--------|--------|-----|
| `@ui/components/StarRating` | Lumelle monorepo UI lib | Use `hero-composition/StarRating.tsx` |
| `@/config/constants` | Lumelle monorepo config | Use local `constants.ts` with `MAX_CART_ITEM_QTY` |
| `@/utils/cdn` → `cdnUrl` | Lumelle monorepo utils | Use `hero-composition/cdn.ts` |
| `@client/shop/cart/providers/CartContext` | Lumelle monorepo | Use `menu-cart-drawer/CartContext.tsx` |
| `@client/shop/products/hooks/useProductContent` | Lumelle monorepo | Wire to your own product data source |
| `@client/shop/products/data/product-config` | Lumelle monorepo | Wire to your own product catalog |
| `@client/shop/products/data/product-handle-aliases` | Lumelle monorepo | Replace with your own handle mapping |
| `@/content/home.config` | Lumelle monorepo content | Replace with your own config |
| `@/layouts/MarketingLayout` | Lumelle monorepo layout | Replace with your layout wrapper |
| `@/components/Seo` | Lumelle monorepo | Replace with your SEO component |
| `@ui/pages/NotFoundPage` | Lumelle monorepo | Replace with your 404 page |
| `@platform/seo/logic/publicBaseUrl` | Lumelle monorepo | Replace with your URL helper |
| `@/lib/analytics/metapixel` | Lumelle monorepo | Replace with your analytics |
| `@/lib/analytics/capi` | Lumelle monorepo | Replace with your CAPI |
| `@client/shop/products/ui/components/SpinWheelPrompt` | Lumelle monorepo | Remove or replace |
| `@client/shop/products/ui/sections` | Lumelle monorepo | Only `HowToSection` is in scope; replace |
| `react-router-dom` | External | `Link`, `Navigate`, `useParams`, `useLocation`, `useNavigate` |

---

## How to Use as Reference

Preserved as-is. For production use:

1. Resolve all `@/` / `@client/` / `@ui/` / `@platform/` alias imports
2. Wire `useCart` to your own cart context
3. Replace `cdnUrl` with your image CDN helper
4. Wire `useProductContent` to your product data source
5. Replace `StarRating` with the version in `hero-composition/`
6. Replace `MarketingLayout` + `Seo` with your layout
7. Remove `SpinWheelPrompt` or wire to your own gamification component
8. Replace analytics calls with your tracking implementation
