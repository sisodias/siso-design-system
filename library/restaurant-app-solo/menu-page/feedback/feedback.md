<!-- Feedback tracker for Menu workstreams. Update as items are addressed. -->

# Menu Feedback Log

Use this living document to capture and resolve feedback specific to the menu domain.

## How to use

1. Add new feedback items to the **Open Items** table with the date, source, and a short summary.
2. Update the **Status** column as work progresses (for example: `new`, `in-progress`, `blocked`, `done`).
3. Once an item is completed, move it to **Resolved Items** so we preserve the history.

## Open Items

| Date (YYYY-MM-DD) | Source / Owner | Summary | Status | Notes |
| --- | --- | --- | --- | --- |
| 2025-10-31 | Client voice transcript | Remove duplicate category nav and settle on single preferred layout | new | Keep only the cleaner categories strip |
| 2025-10-31 | Client voice transcript | Drop the menu hero section and relocate `Order Online` CTA appropriately | new | Landing straight into menu grid |
| 2025-10-31 | Client voice transcript | Restore card metadata: price, best seller/new badges, dietary/spice flags, optional macros | new | Align card schema with real data |
| 2025-10-31 | Client voice transcript | Add customization add-ons (drink syrups, sauces, sides) to cards + item detail | new | Configure modifiers per item type |
| 2025-10-31 | Client voice transcript | Introduce "Pairs well with" recommendations on item detail pages | new | Suggest complementary dishes/drinks |
| 2025-10-31 | Client voice transcript | Surface "Chef's tip" style suggestions on item detail pages | new | Highlight pairing tips or ordering advice |
| 2025-10-31 | Client voice transcript | Build promotions strip that can rotate items by day/time (happy hour, events) | new | Schedulable promo module at top |
| 2025-10-31 | Client voice transcript | Rework category structure into main categories with optional sub-categories | new | E.g., Main Course → Pasta, Pizza, Steak |
| 2025-10-31 | Client voice transcript | Ensure category sliders scroll smoothly when filtering | new | Finish horizontal scroll/animation polish |
| 2025-10-31 | Client voice transcript | Refresh card styling (darker headers/neutral backgrounds) for cleaner look | new | Adjust palette to reduce visual noise |

## Resolved Items

| Date (YYYY-MM-DD) | Source / Owner | Summary | Resolution Date | Notes |
| --- | --- | --- | --- | --- |
| 2025-10-31 | Client request | Increase top padding on menu heading so category pills clear sticky nav | 2025-10-31 | Added page-level offset (`pt-24 md:pt-28`) so hero/pills sit fully below sticky nav |
| 2025-10-31 | Client request | Widen menu cards + reuse landing underline and animated pill accents | 2025-10-31 | Expanded card widths, swapped titles to `AnimatedText`, and added pulsing pill indicator |
| 2025-10-31 | Client request | Restore sticky category selector for quick navigation | 2025-10-31 | Reinstated dropdown selector with smooth scroll + active tracking |
| 2025-10-31 | Client request | Give category group headings the landing-style underline treatment | 2025-10-31 | Swapped group titles to `AnimatedText` with gradient underline |
| 2025-10-31 | Client request | Restyle "About Our Menu" card to match darker theme | 2025-10-31 | Rebuilt panel with dark glass background, white typography, and primary CTA |
| 2025-10-31 | Client request | Split categories into dedicated `/menu/categories` view | 2025-10-31 | Added new route with vertical sections + dropdown linking from menu page |
