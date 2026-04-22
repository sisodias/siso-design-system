# FAQ Section with Review-Card Accordion

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:** luminelle-partnership / `src/domains/client/shop/products/ui/sections/faq-section-shop/FaqSectionShop.tsx`

## What it is
Centered FAQ section with small peach "FAQ" pill eyebrow, large Playfair serif heading "Frequently Asked Questions", live search input with magnifying glass icon (filters questions in real time), then list of white rounded accordion cards. Each card has question + plus/minus toggle icon. Expanded card reveals a "CUSTOMER REVIEW" nested testimonial block: peach pill label + 5-star rating + italic-serif body quote, all on a lighter background with generous padding.

## Design details
- The testimonial-inside-FAQ pattern is distinctive. Plus/minus icons not chevrons. Search is always visible at top. Cards use blush-tinted border.
- `<SectionHeading>` eyebrow uses `bg-semantic-legacy-brand-blush/40` pill with ultra-wide letter-spacing
- Search input has rounded-full pill shape with blush border, clears with X button
- Accordion cards: rounded-3xl, blush border, expand to reveal content
- Expanded card border changes from `border-semantic-accent-cta/40` to `border-semantic-legacy-brand-cocoa/30`
- Review answer detection via `f.a.toLowerCase().startsWith('customer review')`

## Dependencies
- `lucide-react`: Search, Plus, Minus, X (from lucide-react)
- `react` state: useState, useMemo for search filtering

## Known broken imports when isolated
- `@ui/components/SectionHeading` → needs local copy (`./SectionHeading.tsx`)
- `@/config/constants` → needs local copy (`./constants.ts`)

## Design pattern worth canonizing
The review-embedded-accordion treatment is rare and effective. Embedding social proof directly inside FAQ expansion creates a trust-building moment at point of engagement.
