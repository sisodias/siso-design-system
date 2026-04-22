import type { MenuItemCardRendererProps } from './types';
import type { MenuItemCardVariant } from './types';
import type { MenuItemCardContent } from './types';
import { menuItemCardRegistry, getMenuItemCardVariant, getMenuItemCardComponent, listMenuItemCardVariants } from './registry';

export * from './types';
export { menuItemCardRegistry, listMenuItemCardVariants };

export function MenuItemCardRenderer({ variant, fallbackVariant, content, onSelectItem }: MenuItemCardRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuItemCardVariant(requested);
  const Component = getMenuItemCardComponent(resolved);
  return <Component {...content} onSelectItem={onSelectItem} />;
}

export function renderMenuItemCard({ variant, fallbackVariant, content, onSelectItem }: MenuItemCardRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuItemCardVariant(requested);
  const Component = getMenuItemCardComponent(resolved);
  return <Component {...content} onSelectItem={onSelectItem} />;
}

export function getMenuItemCardVariants(): Array<{ key: MenuItemCardVariant; label: string; description: string }> {
  return listMenuItemCardVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { MenuItemCardContent };
