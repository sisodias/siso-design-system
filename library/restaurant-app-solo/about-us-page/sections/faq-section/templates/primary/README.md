# FAQ Template · Primary

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

- **Best for**: Support or marketing pages needing a category-aware accordion with chat styling.
- **Layout**: SectionHeading + filter pills + `FaqAccordion` (chat UI). Optional CTA button below.
- **Content fields**: `pillText`, `title`, `subtitle`, `items`, `showCategories`, `timestamp`, `emptyState`, `cta`.
- **Notes**: When `showCategories` is true we auto-generate category pills from the dataset.
