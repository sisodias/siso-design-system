# Lumelle PDP Bottom CTA Components

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:** luminelle-partnership / `src/domains/client/shop/products/ui/pages/ProductPage/sections/SectionsMap.tsx`

## What's in this folder

1. **`SectionsMap.tsx`** — the complete PDP section orchestrator preserved verbatim as reference for the full layout pattern (shows how all PDP sections compose together: hero → care → reviews → try → essentials → tiktok → faq → bottom CTA).

2. **`PdpBottomCta.tsx`** — the standalone "READY WHEN YOU ARE" bottom CTA card. Props: `{ productHandle, ratingValue, onAdd, onBuy, isAdding, justAdded, bottomCtaChips }`. Eyebrow + serif title switching per product + subtitle with rating + peach Add to Cart button + blush Buy Now button + optional chip row.

3. **`MobileStickyCta.tsx`** — the scroll-triggered sticky mobile buy bar. Props: `{ price, onAdd, onBuy, isAdding, justAdded }`. Fixed-bottom, shows price + Add to Cart + Zap icon Buy Now + dismiss X. Smart show/hide: not visible on hero, hides near footer to avoid double-CTA.

## Why these are keepers

Shaan flagged the "READY WHEN YOU ARE" section explicitly — it's a well-designed conversion moment. The MobileStickyCta is a bonus scroll-aware pattern with smart visibility logic (hero-aware + footer-aware).

## Dependencies

- `react` (useState, useEffect)
- `lucide-react` (ShoppingBag, Zap, X)
- No framer-motion — plain CSS transitions

## Design details

- Section bg: `bg-semantic-legacy-brand-blush/10` with `border-t border-semantic-legacy-brand-blush/50`
- Rounded-full pill buttons (peach CTA, blush secondary)
- Pill chip row for trust badges
- Sticky bar uses `pb-safe` for iOS safe-area

## Known broken imports when isolated

`SectionsMap.tsx` pulls HeroMedia, PriceBlock, HowToSection, FeatureCallouts, DetailsAccordion, ReviewsAutoCarousel, FaqSectionShop, FeaturedTikTok, homeConfig — all already in bank in other folders; reference them when integrating.
