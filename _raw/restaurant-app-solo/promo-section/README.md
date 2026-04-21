# promo-section

**Source:** restaurant-app-solo / src/domains/customer-facing/landing/sections/promo-section/

**What it is:** Promotional section with a signature "LIMITED TIME" pulsing dot pill — a rounded dark pill containing a red pulsing dot and uppercase tracked text. This is the "flashing orb" pill. The pill sits atop a promo hero split (image + copy) followed by a horizontal-scrolling promotion card carousel.

**Why keeper:** The `<Pill>` component (lines 70-102 of PromoPrimary.tsx) is a clean, reusable urgency indicator. Shaan flagged this pattern specifically. Works for time-bound offers, flash sales, live events, or any status indicator.

**Reusable piece inside:** `Pill` with props `label` + `tone` ("dark"|"light") — two-tone support already built-in. The pulsing animation uses a nested `animate-ping` sibling-dot pattern:
```tsx
<span className="relative flex h-1 w-1 items-center justify-center rounded-full bg-foreground/30">
  <span className="flex h-2 w-2 animate-ping items-center justify-center rounded-full bg-foreground/60">
    <span className="flex h-2 w-2 animate-ping items-center justify-center rounded-full bg-foreground/60" />
  </span>
  <span className="absolute top-1/2 left-1/2 flex h-1 w-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground" />
</span>
```
Could become a standalone `PulsingDotPill` primitive later (color + label props only).

**Variants:** only `primary/` template (no variant-2/-3 yet). Section supports a `pillText` prop so label is configurable.

**Dependencies:**
- `lucide-react` — not directly imported; uses inline text arrows (→) instead
- CSS animation `animate-ping` — from Tailwind's built-in animation presets (no extra config needed)
- `@/lib/utils` (cn utility)
- `@/domains/shared/components` (SectionHeading)
- `@/domains/shared/section-tools` (registry helpers)
- `zod`, `next/image`, `next/link`

**Known broken imports (require SISO adaptation):**
- `@/lib/utils` — replace with local `cn` or `@/lib/utils` from isso-dashboard
- `@/domains/shared/components` — replace with equivalent SISO component
- `@/domains/shared/section-tools` — replace with SISO section registry pattern
- `@/domains/shared/section-tools` (schema helpers) — `createSectionSchema` used in types/schema.ts
