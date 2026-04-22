# Menu Item Detail · Primary Variant

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

- **Best for**: Modal or full-screen detail presentations when a guest selects a menu item.
- **Layout**: Hero imagery, price banner, quick facts, nutrition grid, allergens, gallery, and storytelling blocks.
- **Content fields**: Accepts all fields from `MenuItemCardContent` plus `heroImageUrl`, `gallery`, `origin`, `availability`, `winePairing`, `preparationNotes`.
- **Notes**: Pass `isOpen`/`onClose` through the renderer to hook into local dialog state.
