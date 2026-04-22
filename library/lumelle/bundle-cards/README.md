# Lumelle BundleCards

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

Preserved reference from the Luminelle partnership codebase. Do not refactor.

## Source

`luminelle-partnership / src/domains/client/marketing/ui/sections/shop/bundle-cards/BundleCards.tsx`

## What it is

Mobile-first product card section with two cards side-by-side on md+ breakpoints. Each card has:
- Full-bleed image panel (top) with `aspect-square` on mobile, `md:h-80` on desktop
- Peach/white pill overlay at top-left of image: `"FROM £16.99"` — rounded-full, white/85 bg, backdrop-blur, mono-spaced uppercase tracking
- Content block below: Playfair serif title (`font-heading text-2xl`), subtitle paragraph, row of blush-bordered pill feature badges (`"HEATless curls"`, `"30-day returns"`)
- Bottom CTA row: dark-cocoa `rounded-full` "Shop now" button + blush-bordered outlined "Details" button
- Card body: `rounded-[2.5rem]`, `shadow-soft`, blush-tinted image panel bg

## Design details

- Section padding: `py-14 md:py-16`
- Container: `max-w-6xl px-4 md:px-6`
- Grid: 1-col mobile, `md:grid-cols-2` desktop, `gap-6`
- Price pill: `left-5 top-5 absolute`, `rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]`
- Feature badges: `rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]`
- Primary CTA: `rounded-full bg-semantic-legacy-brand-cocoa px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5`
- Secondary CTA: `rounded-full border border-semantic-legacy-brand-blush/60 bg-white px-6 py-3 text-sm font-semibold text-semantic-text-primary transition hover:bg-brand-porcelain/60`

## Dependencies

- `react-router-dom` — `Link as RouterLink` for CTAs
- `@ui/components/SectionHeading` — section header above the grid (see `SectionHeading.tsx`)
- `@client/shop/products/data/product-config` — `productConfigs` dict with `bottomCtaChips`, `gallery`, `defaultTitle`, etc. (see `product-config.ts`)
- `@/lib/utils/cdn` — `cdnUrl()` helper (see `cdn.ts`)

## Known broken imports when isolated

These `@/` alias imports must be resolved before use in a different project:
- `@ui/components/SectionHeading`
- `@client/shop/products/data/product-config`
- `@/lib/utils/cdn`
- `react-router-dom` — Link will need routing integration

## How to use as reference

1. Replace `productConfigs` data source with your own product/catalog data
2. Replace `cdnUrl()` with your image URL helper
3. Replace `SectionHeading` with your design system's heading component
4. Replace `RouterLink` with your router's link component
5. Map Lumelle semantic tokens to your design system tokens:
   - `semantic-legacy-brand-cocoa` → your primary CTA color
   - `semantic-legacy-brand-blush` → your accent/tint color
   - `semantic-text-primary` → your text color
   - `font-heading` → your serif display font
   - `shadow-soft` → your soft shadow utility
