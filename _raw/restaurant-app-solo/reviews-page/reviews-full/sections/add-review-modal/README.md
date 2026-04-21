# Add Review Modal Section

Modal for capturing guest reviews (rating + comment), including authentication gating and validation.

- `types/schema.ts` – records the viewer context (name, authentication flag).
- `templates/primary/` – client component handling form state, validation, and submission callbacks.
- `data/mock.ts` – Storybook/test payload with sample viewer data.
- `index.tsx` / `registry.ts` – renderer helpers exposing `isOpen`, `onClose`, `onSubmit` props.

Current variants: `primary`.
