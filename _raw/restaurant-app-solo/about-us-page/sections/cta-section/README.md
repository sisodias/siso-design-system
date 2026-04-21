# CTA Section Architecture

Follows the shared section playbook (`docs/domains/section-architecture.md`). Use this section to capture dine-in, delivery, or contact CTAs.

- `index.tsx` – public API (`CtaRenderer`, `renderCta`, typed helpers).
- `registry.ts` – variant registry metadata + component map.
- `types/` – Zod schema (`ctaContentZodSchema`) and delivery partner contract.
- `data/mock.ts` – Storybook/test payloads for each variant.
- `templates/<variant>/` – concrete layouts with metadata + README notes.
- `stories/` & `tests/` – registry smoke tests and variant previews.

## Variants

| Key         | Label             | Summary                                             |
|-------------|-------------------|-----------------------------------------------------|
| `primary`   | Full-Bleed Hero   | Background image hero with dual CTAs + delivery bar |
| `template-2`| Split Panel       | Placeholder for two-column CTA card                 |
| `template-3`| Minimal Banner    | Placeholder banner for announcements/newsletter     |

Template 2 and 3 are intentionally empty placeholders—swap in final UI from 21st.dev or custom components when ready.
