# Review Card Section

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

Gradient testimonial card used inside the reviews grid.

- `types/schema.ts` – validates the review payload passed into the card.
- `templates/primary/` – interactive card with highlights, owner response, and helpful vote button.
- `data/mock.ts` – Draco sample review used in Storybook/tests.
- `index.tsx` / `registry.ts` – renderer helpers that expose helpful/image click callbacks.

Current variants: `primary`.
