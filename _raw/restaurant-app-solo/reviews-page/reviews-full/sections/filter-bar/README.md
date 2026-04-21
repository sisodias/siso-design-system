# Filter Bar Section

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

Interactive sidebar filters for the reviews domain.

- `types/schema.ts` – ensures we pass totals and rating breakdown counts.
- `templates/primary/` – client component wired to Next.js router/search params.
- `data/mock.ts` – fixture used for Storybook and tests.
- `index.tsx` / `registry.ts` – renderer helpers and metadata.

Current variants: `primary`.
