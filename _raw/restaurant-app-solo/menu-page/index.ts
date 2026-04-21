/**
 * Menu Domain - Public API
 * Template-Based Architecture with Root-Level Shared Code
 *
 * Structure:
 * - types/      → Shared types
 * - hooks/      → Shared hooks & services
 * - utils/      → Shared utilities
 * - [name]-templates/
 *   ├── primary/     → Main implementation
 *   ├── template-2/  → Alternative design (placeholder)
 *   └── template-3/  → Alternative design (placeholder)
 */

// ============================================================================
// PAGES
// ============================================================================
export { default as MenuPage } from "./pages/MenuPage";
// NOTE: AdminMenuPage not exported here due to server actions

// ============================================================================
// SECTION RENDERERS
// ============================================================================
export { MenuHeaderRenderer, renderMenuHeader, menuHeaderRegistry, getMenuHeaderVariants } from './sections/menu-header';
export type { MenuHeaderContent, MenuHeaderVariant, MenuHeaderCTA } from './sections/menu-header';
export { MenuCategoriesRenderer, renderMenuCategories, menuCategoriesRegistry, getMenuCategoriesVariants } from './sections/menu-categories';
export type {
  MenuCategoriesContent,
  MenuCategoriesVariant,
  MenuCategoriesAbout,
  MenuCategoryItem,
  MenuCategorySummary,
} from './sections/menu-categories';
export {
  MenuCategorySelectorRenderer,
  renderMenuCategorySelector,
  menuCategorySelectorRegistry,
  getMenuCategorySelectorVariants,
} from './sections/menu-category-selector';
export type {
  MenuCategorySelectorContent,
  MenuCategorySelectorVariant,
  MenuCategorySelectorCategory,
} from './sections/menu-category-selector';
export {
  MenuItemCardRenderer,
  renderMenuItemCard,
  menuItemCardRegistry,
  getMenuItemCardVariants,
} from './sections/menu-item-card';
export type {
  MenuItemCardContent,
  MenuItemCardVariant,
} from './sections/menu-item-card';
export {
  MenuItemDetailRenderer,
  renderMenuItemDetail,
  menuItemDetailRegistry,
  getMenuItemDetailVariants,
} from './sections/menu-item-detail';
export type {
  MenuItemDetailContent,
  MenuItemDetailVariant,
} from './sections/menu-item-detail';

// ============================================================================
// SHARED TYPES (from domain root)
// ============================================================================
export type {
  MenuItem,
  MenuCategory,
  MenuItemsByCategory,
  MenuFilters
} from './shared/types';

export {
  FALLBACK_MENU_ITEMS,
  FALLBACK_CATEGORIES,
  MENU_QUERY_CONFIG
} from './shared/types';

// ============================================================================
// SHARED HOOKS (from domain root)
// ============================================================================
export {
  useMenuItems,
  useMenuCategories,
  useMenuItemsByCategory,
  usePrefetchMenuData,
} from './shared/hooks';

// ============================================================================
// SHARED SERVICES (from domain root)
// ============================================================================
export {
  fetchMenuItems,
  fetchMenuCategories,
  fetchMenuItemsByCategory,
  groupMenuItemsByCategory,
  filterMenuItems,
  searchMenuItems,
} from './shared/hooks';

// ============================================================================
// SHARED UTILS (from domain root)
// ============================================================================
export * from './shared/utils';
