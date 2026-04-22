import type { MenuCategoriesRendererProps } from './types';
import type { MenuCategoriesVariant } from './types';
import type { MenuCategoriesContent } from './types/schema';
import { menuCategoriesRegistry, getMenuCategoriesVariant, getMenuCategoriesComponent, listMenuCategoriesVariants } from './registry';

export * from './types';
export { menuCategoriesRegistry, listMenuCategoriesVariants };

export function MenuCategoriesRenderer({ variant, fallbackVariant, content }: MenuCategoriesRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuCategoriesVariant(requested);
  const Component = getMenuCategoriesComponent(resolved);
  return <Component {...content} />;
}

export function renderMenuCategories({ variant, fallbackVariant, content }: MenuCategoriesRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuCategoriesVariant(requested);
  const Component = getMenuCategoriesComponent(resolved);
  return <Component {...content} />;
}

export function getMenuCategoriesVariants(): Array<{ key: MenuCategoriesVariant; label: string; description: string }> {
  return listMenuCategoriesVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { MenuCategoriesContent };
