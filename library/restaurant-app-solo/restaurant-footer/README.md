# RestaurantFooter — Design System Bank Entry

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:**** `restaurant-app-solo` / `src/domains/shared/components/RestaurantFooter/`

---

## What it is

The full restaurant footer block. Structure:
- Centered DRACO logo + "COFFEE AND EATERY" tagline
- Green "OPEN NOW · Open until 11:00 PM" status line
- Address with MapPin icon
- Horizontal divider
- 2-up action card row: **Grab** (Grab green logo + "Fast delivery" + green pill "Order Now") | **WhatsApp** (WhatsApp logo + "Quick response" + green pill "Chat Now")
- Full-width pink-purple gradient Instagram card: "@draco.cofeeandeatery · See our daily specials"
- Copyright line + "Built with by SISO Agency" credit

Shaan flagged: "all on the landing page, nothing crazy but keeper."

---

## Why keeper

The 2-up Grab/WhatsApp action card pattern is reusable for any restaurant with delivery + chat channels. The SISO Agency credit line is a branding detail worth preserving.

---

## Sub-components to call out

| Component | File | Why clean extraction candidate |
|-----------|------|-------------------------------|
| `PrimaryActionCards` | `primary/PrimaryActionCards.tsx` | 2-column Grab + WhatsApp card row; self-contained, zero tenant coupling. Best extraction candidate. |
| `EnhancedHoursLocation` | `primary/EnhancedHoursLocation.tsx` | OPEN NOW badge + address block; isolated props (address, hours). Second-best candidate. |
| `RestaurantFooterPro` | `primary/RestaurantFooterPro.tsx` | Composed whole; couples to TenantProvider + siteConfig. Not standalone. |
| `ActionOrientedSocial` | `primary/ActionOrientedSocial.tsx` | Instagram gradient card; self-contained, rebrandable gradient. |
| `SocialProof` | `primary/SocialProof.tsx` | Stars, halal/organic badges, payment methods. |

---

## Variants

| Variant | Status | Notes |
|---------|--------|-------|
| `primary/` | Active, production-ready | 12 files — main implementation |
| `variant-2/` | Empty | Reserved |
| `variant-3/` | Empty | Reserved |

---

## File inventory

```
restaurant-footer/
├── ORIGINAL_README.md
├── index.ts                           (proxies primary/ exports)
├── primary/
│   ├── RestaurantFooterPro.tsx       (main, couples to TenantProvider)
│   ├── PrimaryActionCards.tsx         ← extraction candidate #1
│   ├── EnhancedHoursLocation.tsx       ← extraction candidate #2
│   ├── ActionOrientedSocial.tsx        (Instagram gradient card)
│   ├── SocialProof.tsx                (stars, badges, payments)
│   ├── types.ts                       (ContactInfo, RestaurantFeatures, OperatingHours)
│   ├── CompactInfoCard.tsx             (legacy, compact info row)
│   ├── DeliveryPartners.tsx            (legacy, GoFood/Grab/ShopeeFood grid)
│   ├── LocationCard.tsx                (legacy, blue directions card)
│   ├── OperatingHoursCard.tsx          (legacy, card-style hours)
│   ├── QuickContactSection.tsx         (legacy, tap-to-call/WhatsApp)
│   ├── WhatsAppSubscribe.tsx           (legacy, subscribe CTA)
│   └── index.ts
└── variant-2/  (empty)
variant-3/  (empty)
```

**Total LOC (non-empty files only):** ~1,380 lines across 12 TSX + 1 types + 2 index files.

---

## Known broken imports

The following imports reference the `restaurant-app-solo` monorepo and will not resolve in isolation:

- `@/domains/shared/components` — `Button` used in `PrimaryActionCards.tsx`, `WhatsAppSubscribe.tsx`
- `@/providers/TenantProvider` — `useTenant()` hook in `RestaurantFooterPro.tsx`
- `/images/shared/partners/grab-food.svg` — Grab logo (public static asset)
- `/images/shared/icons/whatsapp.svg` — WhatsApp logo (public static asset)
- `/images/shared/icons/instagram.svg` — Instagram logo (public static asset)
- `/images/tenants/draco/brand/logo/draco-main-logo.svg` — tenant brand logo (public static asset)

All `lucide-react` icon imports (`MapPin`, `Clock`, `Star`, `CreditCard`, `CheckCircle`, `ChevronRight`, `Phone`, `MessageCircle`, `ShoppingBag`) are valid and transfer cleanly.

---

## Dependencies

- `next/image` — brand logos
- `lucide-react` — MapPin, Clock, Star, CreditCard, CheckCircle, ChevronRight, Phone, MessageCircle, ShoppingBag
- `react` (implicit via Next.js)
