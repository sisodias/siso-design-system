# Menu Category Selector · Primary Variant

- **Best for**: Sticky category navigation with dropdown support for menus containing many categories.
- **Layout**: Section heading, summary, filter toggle button, and horizontally scrollable tab list that highlights the active category.
- **Content fields**: `heading`, `summary`, `filterLabel`, `allLabel`, `activeCategoryId`, `categories[]` (id, name, description, count, pillText, isActive).
- **Notes**: Supply `onSelectCategory` when using the renderer so selection events bubble back to the page state.
