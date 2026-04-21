# Hero Section Architecture

This section implements the shared section playbook (`docs/domains/section-architecture.md`). Key touch points:

- `index.tsx` – public API (`HeroRenderer`, `renderHero`, types, registry exports).
- `registry.ts` – variant registry metadata + synchronous component map.
- `types/` – shared TypeScript contracts and Zod schema (`heroContentSchema`).
- `data/mock.ts` – reusable sample payloads for Storybook/tests.
- `shared/` – reserved for atoms, hooks, utils shared by multiple variants.
- `templates/<variant>/` – self-contained variants with metadata + README.
- `stories/` – Storybook stories rendering every variant from mocks.
- `tests/` – lightweight registry coverage to catch wiring regressions.

| Variant Key  | Label             | Summary                                      |
|--------------|-------------------|----------------------------------------------|
| `primary`    | Full-Bleed Statement | Cinematic hero focused on photography.     |
| `template-2` | Minimal Spotlight  | Text-forward layout with generous whitespace. |
| `template-3` | Split Feature      | Two-column story paired with imagery.        |

All variants consume the same `HeroContent` shape. If a variant needs extra fields, extend locally and document the difference inside its README.
