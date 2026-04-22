# restaurant-app-solo / about-us-page

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

## Source
`restaurant-app-solo / src/domains/customer-facing/about-us/`

## What it is
Full About Us page composed of 10 independent sections. Shaan's verdict: decent keeper with multiple reusable sections. Shaans quote: "the About Us page isn't that bad."

## Sections (10 total)
| Section | Shaans verdict | Variants |
|---|---|---|
| `hero-section` | "alright-ish" | primary, template-2, template-3 |
| `venue-gallery-section` | — | primary, template-2, template-3 |
| `story-section` | "alright" | primary, template-2, template-3 |
| `cuisine-philosophy-section` | — | primary, template-2, template-3 |
| `awards-section` | — | primary only |
| `team-section` | — | primary, template-2, template-3 |
| `values-section` | — | primary, template-2, template-3 |
| `location-section` | — | primary, template-2, template-3 |
| `faq-section` | "the question pills on there are alright" | primary, template-2, template-3 |
| `cta-section` | — | primary, template-2, template-3 |

**Question pills** are the category filter chips in `faq-section/templates/primary/components/FAQSection.tsx` — rounded pill-style category filter buttons (All / General / Ordering / Dining / Delivery) rendered inside `FaqPrimary.tsx`.

## Reusable primitives to flag
- **Hero pill badge** — `inline-flex rounded-full` chip with `Sparkles` lucide icon (hero primary, line ~93)
- **MetaBadge** — rounded stat badge for hero metadata row
- **Story timeline** — via `@/components/ui/timeline-component`
- **FAQ category pills** — chip row filter (primary + template-2, template-3)
- **FAQ chat accordion** — `FaqAccordion` wrapper
- **Team glass card carousel** — `TeamGlassCard` inside `Carousel`
- **Values grid** — card grid with `ShineBorder` effect
- **Location contact block** — address/phone/social chips
- **Venue gallery** — grid + auto-slider layouts

## Dependencies (will be broken in SISO)
- `next/image` — OK
- `lucide-react` — OK
- `framer-motion` — OK (confirmed in hero section)
- `@/domains/shared/section-tools` — BROKEN (90 imports)
- `@/domains/shared/components` — BROKEN (18 imports)
- `@/lib/utils` — BROKEN (10 imports)
- `@storybook/react` — BROKEN (10 imports, test-only)
- `@/components/ui/faq-chat-accordion` — BROKEN (3 imports)
- `@/components/ui/timeline-component` — BROKEN (2 imports)
- `@/components/ui/retro-testimonial` — BROKEN (2 imports)
- `@/components/ui/button` — BROKEN (1 import)

## Known broken imports (top 10 by frequency)
1. `@/domains/shared/section-tools` — 90 refs (registry, template, type utils)
2. `@/domains/shared/components` — 18 refs (SectionHeading, etc.)
3. `@/lib/utils` — 10 refs (cn utility)
4. `@storybook/react` — 10 refs (StoryObj, Meta)
5. `@/components/ui/faq-chat-accordion` — 3 refs
6. `@/components/ui/timeline-component` — 2 refs
7. `@/components/ui/retro-testimonial` — 2 refs (Carousel)
8. `@/domains/customer-facing/landing/sections/review-section/.../TestimonialsColumn` — 1 ref
9. `@/components/ui/image-auto-slider` — 1 ref
10. `@/components/ui/button` — 1 ref (buttonVariants)

## Stats
- **Total files:** ~140
- **Total LOC (TS/TSX):** 5,925
- **Section count:** 10
- **Variants per section:** 3 (primary + template-2 + template-3) except awards (1)
