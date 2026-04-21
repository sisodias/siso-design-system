import type { ComponentType } from 'react';
import type { MenuItemCardContent } from './schema';

export type MenuItemCardVariant = 'primary';

export interface MenuItemCardRendererProps {
  variant?: MenuItemCardVariant;
  content: MenuItemCardContent;
  fallbackVariant?: MenuItemCardVariant;
  onSelectItem?: (itemId: string) => void;
}

export type MenuItemCardComponent = ComponentType<MenuItemCardContent & {
  onSelectItem?: (itemId: string) => void;
}>;

export type { MenuItemCardContent } from './schema';
