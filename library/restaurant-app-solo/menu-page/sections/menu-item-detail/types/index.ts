import type { ComponentType } from 'react';
import type { MenuItemDetailContent } from './schema';

export type MenuItemDetailVariant = 'primary';

export interface MenuItemDetailRendererProps {
  variant?: MenuItemDetailVariant;
  content: MenuItemDetailContent;
  fallbackVariant?: MenuItemDetailVariant;
  isOpen?: boolean;
  onClose?: () => void;
}

export type MenuItemDetailComponent = ComponentType<MenuItemDetailContent & {
  isOpen?: boolean;
  onClose?: () => void;
}>;

export type { MenuItemDetailContent } from './schema';
