import type { MenuCategorySelectorRendererProps } from './types';
import type { MenuCategorySelectorVariant } from './types';
import type { MenuCategorySelectorContent } from './types';
import { menuCategorySelectorRegistry, getMenuCategorySelectorVariant, getMenuCategorySelectorComponent, listMenuCategorySelectorVariants } from './registry';

export * from './types';
export { menuCategorySelectorRegistry, listMenuCategorySelectorVariants };

export function MenuCategorySelectorRenderer({ variant, fallbackVariant, content, onSelectCategory }: MenuCategorySelectorRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuCategorySelectorVariant(requested);
  const Component = getMenuCategorySelectorComponent(resolved);
  return <Component {...content} onSelectCategory={onSelectCategory} />;
}

export function renderMenuCategorySelector({ variant, fallbackVariant, content, onSelectCategory }: MenuCategorySelectorRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuCategorySelectorVariant(requested);
  const Component = getMenuCategorySelectorComponent(resolved);
  return <Component {...content} onSelectCategory={onSelectCategory} />;
}

export function getMenuCategorySelectorVariants(): Array<{ key: MenuCategorySelectorVariant; label: string; description: string }> {
  return listMenuCategorySelectorVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { MenuCategorySelectorContent };
