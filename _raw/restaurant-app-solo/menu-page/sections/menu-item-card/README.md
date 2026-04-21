# MenuItemCard Section Architecture

Scaffolded with `pnpm scaffold:section menu menu-item-card`. Update the generated files to match the section's data contract and UI.

- `index.tsx` – public API (renderer, helpers, types).
- `registry.ts` – variant registry metadata and component map.
- `types/` – Zod schema + TypeScript types shared by all variants.
- `data/mock.ts` – Storybook/test payloads.
- `shared/` – reusable atoms/hooks/utils for the section.
- `templates/<variant>/` – variant implementations plus metadata and README.
- `stories/` – Storybook stories rendering every variant from mocks.
- `tests/` – smoke tests for registry wiring.

Variants scaffolded: `primary`.

See `docs/domains/section-architecture.md` for the full playbook.
