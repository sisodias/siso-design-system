# Awards Section Architecture

Derives from the shared section playbook (`docs/domains/section-architecture.md`). This section surfaces review scores, testimonials, and award badges to build social proof.

- `index.tsx` – public API (`AwardsRenderer`, `renderAwards`, typed helpers).
- `registry.ts` – variant metadata + component map.
- `types/` – Zod schema (`awardsContentZodSchema`) and exported contracts for testimonials/achievements.
- `data/mock.ts` – reusable Storybook and test payloads.
- `templates/<variant>/` – variant implementations with metadata and README guidance.
- `stories/` & `tests/` – smoke coverage for registry and previewing variants.

## Variants

| Key         | Label                | Summary                                           |
|-------------|----------------------|---------------------------------------------------|
| `primary`   | Awards & Social Proof | Gradient rating hero with testimonials + badges   |
| `template-2`| Guest Spotlight       | Compact single-testimonial spotlight card         |
| `template-3`| Awards Timeline       | Grid of accolades for press/timeline callouts     |

All variants share the `AwardsContent` shape. Extend locally if a future template needs extra props and document the additions inside the template README.
