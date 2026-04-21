# Reviews Grid Section

Renders the two-column review layout, wires review cards, and controls the media lightbox.

- `types/schema.ts` – typed review payload (matches Supabase shape used by cards).
- `templates/primary/` – client component managing lightbox state and helpful callbacks.
- `data/mock.ts` – Draco sample reviews for Storybook/tests.
- `index.tsx` / `registry.ts` – renderer helpers with optional helpful click handler.

Current variants: `primary`.
