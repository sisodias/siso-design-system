# Add Review Modal Section

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

Modal for capturing guest reviews (rating + comment), including authentication gating and validation.

- `types/schema.ts` – records the viewer context (name, authentication flag).
- `templates/primary/` – client component handling form state, validation, and submission callbacks.
- `data/mock.ts` – Storybook/test payload with sample viewer data.
- `index.tsx` / `registry.ts` – renderer helpers exposing `isOpen`, `onClose`, `onSubmit` props.

Current variants: `primary`.
