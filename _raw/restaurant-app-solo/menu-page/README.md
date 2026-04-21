# restaurant-app-solo / menu-page

**Source:** `restaurant-app-solo / src/domains/customer-facing/menu/`

**What it is:** The full customer-facing menu experience. Shaan's quote: "the menu cards on the menu page are quite good."

**Visible in Shaan's screenshot:** Dark menu-item card with "STARTERS" category eyebrow pill, food photo w/ green + blue diet badges in top-right corner, price pill bottom-left ("Rp 14"), Playfair bold title "Burrata Caprese", ingredient line, prep time icon + "8 min", dietary pills ("Vegetarian", "Gluten Free"), nutrition chip row ("280 cal", "12g protein", "10g carbs", "7g sugar", "20g fat"), weight row ("8m", "~220g"), allergen pill row ("Allergens: Dairy"), pairs-with line, chef tip. EXTREMELY dense, well-organized food card.

**Why keeper:** The nutrition chip row + allergen pill + dietary badge corner overlay pattern is an extremely information-dense food card done well.

**Reusable primitives inside:** chip row with emoji + data, price pill corner overlay, diet badge corner cluster.

**Variants:** All 5 sections use `templates/primary/` only. No `variant-2`/`variant-3` folders exist anywhere.

**Dependencies:** `next/image`, `lucide-react`.

---

## Sub-folders

### `menu-item-card/` — The dense food card
279 LOC in `templates/primary/MenuItemCardPrimary.tsx`. The full nutrition chip row, dietary badge corner cluster, price pill, allergen pills, chef tip, pairs-with. Source of the screenshot-accurate card.

### `menu-item-detail/` — Expanded item view
497 LOC in `templates/primary/MenuItemDetailPrimary.tsx`. Full-page expansion of a menu item with hero image, all metadata, add-ons, related items.

### `menu-categories/` — Category grouping
486 LOC in `templates/primary/MenuCategoriesPrimary.tsx`. Groups items by category with icons, about section, empty/error/loading states.

### `menu-category-selector/` — Top category switcher
129 LOC in `templates/primary/MenuCategorySelectorPrimary.tsx`. Tab-based category navigation.

### `menu-header/` — Menu page header
58 LOC in `templates/primary/MenuHeaderPrimary.tsx`. Restaurant name, tagline, seed-data button.

### `pages/`
7 pages: `MenuPage.tsx`, `MenuPageClient.tsx`, `MenuPageImproved.tsx`, `MenuPageNew.tsx`, `MenuCategoriesPage.tsx`, `AdminMenuPage.tsx`, `MenuPageCategorySections.tsx`. Pages are NOT page-components in isolation; they import shared/ and sections/ — they are entry points.

### `shared/`
Core domain primitives:
- `types/menu.types.ts` (57 LOC) — `MenuItem`, `MenuCategory`, dietary flags, nutrition, allergens
- `types/menu.constants.ts` (201 LOC) — dietary icons map, cuisine types, prep time labels
- `data/menu-static.ts` (174 LOC) — hardcoded menu data
- `data/draco-menu.ts` (473 LOC) — large fixture data
- `utils/menu-images.ts` (228 LOC) — image URL resolution
- `utils/menu-grouping.ts` (98 LOC) — `groupMenuItemsByCategory`, `groupMenuSections`
- `utils/enrich-menu-items.ts` (201 LOC) — adds computed fields to raw items
- `hooks/use-menu.ts` (141 LOC) — data fetching hook
- `services/menu.service.ts` (258 LOC) — service layer
- `services/menu.repository.ts` (170 LOC) — repository/data access
- `components/MenuAccordion.tsx` (83 LOC)
- `components/error-boundary/ErrorBoundary.tsx` (117 LOC)
- `components/fallbacks/` — `MenuEmpty`, `MenuError`, `MenuSkeleton`

---

## Known broken imports (deduped — all point outside this folder)

| # | Import prefix | Files |
|---|--------------|-------|
| 1 | `@/domains/shared/components` | 14 files |
| 2 | `@/domains/shared/section-tools` | 9 files |
| 3 | `@/lib/supabase/client` | 1 file |
| 4 | `@/lib/types/Result` | 1 file |
| 5 | `@/domains/client-facing/components/SeedDataButton` | 1 file |
| 6 | `@/lib/utils/currency` | 1 file |
| 7 | `@/lib/supabase/withTenantSupabase` | 1 file |
| 8 | `@/lib/utils` | 2 files |
| 9 | `@/components/ui/alert` | 2 files |
| 10 | `@/domains/shared/hooks/useTenantServer` | 1 file |

Total TS/TSX LOC: **6,982**
