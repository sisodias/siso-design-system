# Team Section Architecture

Follows the shared section playbook (`docs/domains/section-architecture.md`). This section introduces the people behind the restaurant.

- `index.tsx` – public API (`TeamRenderer`, `renderTeam`, typed helpers).
- `registry.ts` – variant registry metadata + component map.
- `types/` – Zod schema (`teamContentZodSchema`) and `TeamMember` contract.
- `data/mock.ts` – Storybook/test payloads for each variant.
- `templates/<variant>/` – layout implementations with metadata + README guidance.
- `stories/` & `tests/` – registry smoke tests and variant previews.

## Variants

| Key         | Label             | Summary                                            |
|-------------|-------------------|----------------------------------------------------|
| `primary`   | Carousel Showcase | Retro testimonial carousel for hero-style sections |
| `template-2`| Team Card Grid    | Responsive three-up cards for compact layouts      |
| `template-3`| Narrative Strip   | Placeholder for future slider / timeline concept   |

Template `template-3` is intentionally a placeholder—replace with final UI (e.g., 21st.dev component) before shipping.
