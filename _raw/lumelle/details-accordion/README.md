# DetailsAccordion

## Source

`luminelle-partnership / src/domains/client/shop/products/ui/sections/details-accordion/DetailsAccordion.tsx`

## What it is

Clean accordion section with centered eyebrow pill ("EVERYTHING YOU NEED"), Playfair serif title ("Materials, care & fit"), subtitle ("Quick references before you add it to your cart."), and list of expandable rows. Each row has a tight title + tiny dropdown indicator (▸ collapsed, rotates 90deg when open). Expanded content shows body copy. Rows are hair-line separated with generous vertical padding.

## Why this is a keeper

Shaan said "really nice, clean, good" — used as the clean minimal alternative to the more playful FAQ section. Good for technical/spec content.

## Dependencies

- `SectionHeading` — already in the design-system bank at `lumelle/hero-composition/SectionHeading.tsx`; rewire import to local reference path.
- Native HTML `<details>`/`<summary>` — no animation library needed.
- `react` — open/close state handled by browser via `<details>` element.

## Known broken imports when isolated

- `@ui/components/SectionHeading` → must be rewired to local relative import of the existing `SectionHeading` in the bank.

## How to use as reference

Preserved as-is. Drop into any page and pass:

```tsx
<DetailsAccordion
  sectionId="care"
  heading={{ eyebrow: 'EVERYTHING YOU NEED', title: 'Materials, care & fit', description: 'Quick references before you add it to your cart.' }}
  items={[
    { title: 'Materials', body: '...' },
    { title: 'Care Instructions', body: '...' },
    { title: 'Fit Guide', body: '...' },
  ]}
/>
```

Each `DetailItem` accepts optional `thumbSrc` / `thumbAlt` for a thumbnail icon beside the row title.
