# Instagram Section

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:**** `restaurant-app-solo` / `src/domains/customer-facing/landing/sections/instagram-section/`

**What it is:** "Follow us on Instagram" landing section. Structure: centered Instagram handle pill ("@yourrestaurant" with IG icon), Playfair bold heading "Follow us on Instagram" with pink-purple underline accent, supporting tagline ("Follow us for exclusive offers & 10% off your first order!"), 2x2 grid of circular-cornered food photos (chicken, pancakes, pizza, cake), bottom gradient pink-to-purple pill CTA "Follow for 10% Off →".

**Why keeper:** Shaan flagged this as "cool" — it's a well-composed Instagram follower-grab section with visually compelling food photo grid.

**Reusable bits:** the 2x2 rounded image grid and the gradient-pill CTA at bottom are both extractable patterns. The Instagram handle pill with inline icon is also independently reusable.

**Tests + stories present:**
- `stories/InstagramSection.stories.tsx` — Storybook stories (Primary variant)
- `tests/instagramsection.spec.ts` — Vitest tests covering registry helpers (`instagramRegistry`, `listInstagramVariants`, `getInstagramVariant`)

Both are preserved as reference for testing/documenting sections.

**Dependencies:**
- `next/image` — food photo grid
- `lucide-react` — Instagram icon, ArrowRight icon
- `react` — hooks (useEffect, useRef, useState)
- `zod` — content schema validation
- `@storybook/react` — Storybook stories
- `vitest` — tests

**Known broken imports (internal, project-specific — will not resolve in isolation):**
- `@/domains/shared/section-tools`
- `@/domains/shared/components`
- `@/domains/customer-facing/landing/sections/instagram-section/types/schema`

**Files:** 14 files across `data/`, `shared/`, `stories/`, `templates/primary/`, `tests/`, `types/`, `index.tsx`, `registry.ts` — **314 LOC** (TS/TSX only)
