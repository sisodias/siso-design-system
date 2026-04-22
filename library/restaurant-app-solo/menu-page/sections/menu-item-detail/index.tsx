import type { MenuItemDetailRendererProps } from './types';
import type { MenuItemDetailVariant } from './types';
import type { MenuItemDetailContent } from './types';
import { menuItemDetailRegistry, getMenuItemDetailVariant, getMenuItemDetailComponent, listMenuItemDetailVariants } from './registry';

export * from './types';
export { menuItemDetailRegistry, listMenuItemDetailVariants };

export function MenuItemDetailRenderer({ variant, fallbackVariant, content, isOpen, onClose }: MenuItemDetailRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuItemDetailVariant(requested);
  const Component = getMenuItemDetailComponent(resolved);
  return <Component {...content} isOpen={isOpen} onClose={onClose} />;
}

export function renderMenuItemDetail({ variant, fallbackVariant, content, isOpen, onClose }: MenuItemDetailRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuItemDetailVariant(requested);
  const Component = getMenuItemDetailComponent(resolved);
  return <Component {...content} isOpen={isOpen} onClose={onClose} />;
}

export function getMenuItemDetailVariants(): Array<{ key: MenuItemDetailVariant; label: string; description: string }> {
  return listMenuItemDetailVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { MenuItemDetailContent };
