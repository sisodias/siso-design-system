# Image Lightbox Section

Fullscreen media viewer used by the reviews grid.

- `types/schema.ts` – ensures we pass an array of image URLs and the active index.
- `templates/primary/` – client component handling keyboard controls and navigation callbacks.
- `data/mock.ts` – demo images for Storybook/tests.
- `index.tsx` / `registry.ts` – renderer helpers exposing `onClose`, `onNext`, and `onPrev`.

Current variants: `primary`.
