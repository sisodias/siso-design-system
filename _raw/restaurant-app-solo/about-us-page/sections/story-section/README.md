# Story Section Architecture

Built with the shared section playbook (`docs/domains/section-architecture.md`). This section narrates the brand journey with reusable milestone data.

- `index.tsx` – public API (`StoryRenderer`, `renderStory`, typed helpers).
- `registry.ts` – variant metadata + component map.
- `types/` – Zod schema (`storyContentZodSchema`) and `StoryMilestone` contract.
- `data/mock.ts` – example milestone payloads for Storybook/tests.
- `templates/<variant>/` – concrete layouts (timeline, card grid, story arc) with metadata + README.
- `stories/` & `tests/` – variant previews and registry smoke tests.

## Variants

| Key         | Label             | Summary                                                |
|-------------|-------------------|--------------------------------------------------------|
| `primary`   | Milestone Timeline | Vertical timeline powered by GlassTimeline component |
| `template-2`| Milestone Cards    | Two-column card grid for executive summaries          |
| `template-3`| Story Arc          | Three-act progression with numbered waypoints         |

All variants consume `StoryContent` (`title`, `subtitle`, `milestones[]`). Extend locally for new layouts and document additions in the template README.
