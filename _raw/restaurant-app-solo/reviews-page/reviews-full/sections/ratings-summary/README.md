# Ratings Summary Section

This section renders the stats header that sits on top of the reviews page.

- `types/schema.ts` – Zod contract for rating averages, totals, and breakdown.
- `templates/primary/` – gradient card implementation that accepts an `actionSlot` (Write Review button).
- `data/mock.ts` – Storybook/test payload seeded with Draco sample metrics.
- `index.tsx` / `registry.ts` – renderer helpers and variant metadata.

Current variants: `primary`.

Use `pnpm scaffold:section reviews ratings-summary --variants=primary` if you need to regenerate the scaffold for a new variant.
