# ProductSpotlightSection

Preserved verbatim from the Lumelle partnership project.

## Source

`luminelle-partnership/src/domains/client/marketing/ui/sections/shop/product-spotlight-section/ProductSpotlightSection.tsx`

## What it is

Mobile-first product hero card that fits almost exactly one viewport. Rounded square product image at top (lifestyle shot), small uppercase eyebrow label "PRODUCT SPOTLIGHT", Playfair serif product title "Lumelle Shower Cap", star rating + review count row (4.8 (100+ reviews)), description paragraph, bullet list of peach-dotted features ("Reusable waterproof", "Satin lined", "Large wide shower cap", "Adjustable"), price row with red "-25%" discount pill + large price + small "RRP: £19.99" strikethrough, and bottom "SHOP THE CAP" rounded-full outlined CTA button spanning full width.

## Design details

Shaan flagged "fits the screen almost perfectly" — the design is carefully proportioned for single-viewport mobile. Star rating uses the StarRating atom (keeper #1 dependency). Bullet dots are peach filled circles (not Lucide icons). Discount pill is a distinct red ("-25%" in white on red).

## Dependencies

- `StarRating.tsx` — star rating atom
- `cdn.ts` — Cloudinary cdnUrl helper
- `@content/home.types` — HomeConfig type for teaser data
- `react-router-dom` — Link/RouterLink

## Known broken imports when isolated

```
import { StarRating } from '@ui/components/StarRating'
import type { HomeConfig } from '@content/home.types'
import { cdnUrl } from '@/lib/utils/cdn'
```

## How to use as reference

Preserved as-is. Swap product data source + image helper.
