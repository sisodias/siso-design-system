# Menu Item Card · Primary Variant

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

- **Best for**: Highlighting individual dishes in carousels or responsive grids.
- **Layout**: Hero image with gradient overlay, price + prep time ribbon, dietary/nutrition chips, and allergen badges.
- **Content fields**: `id`, `name`, `description`, `price`, `currency`, `category`, `imageUrl`, booleans (`isVegetarian`, `isVegan`, `isGlutenFree`, `isSpicy`), nutrition metrics, `allergens`, `pairings`, `chefTip`, `popularScore`, `badges`.
- **Notes**: Provide an `onSelectItem` handler through the renderer to open detail dialogs or navigate to item pages.
