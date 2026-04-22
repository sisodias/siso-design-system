# Image Lightbox Section

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

Fullscreen media viewer used by the reviews grid.

- `types/schema.ts` – ensures we pass an array of image URLs and the active index.
- `templates/primary/` – client component handling keyboard controls and navigation callbacks.
- `data/mock.ts` – demo images for Storybook/tests.
- `index.tsx` / `registry.ts` – renderer helpers exposing `onClose`, `onNext`, and `onPrev`.

Current variants: `primary`.
