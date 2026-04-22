import type { ComponentType } from 'react';
import type { MenuCategorySelectorContent } from './schema';

export type MenuCategorySelectorVariant = 'primary';

export interface MenuCategorySelectorRendererProps {
  variant?: MenuCategorySelectorVariant;
  content: MenuCategorySelectorContent;
  fallbackVariant?: MenuCategorySelectorVariant;
  onSelectCategory?: (categoryId: string) => void;
}

export type MenuCategorySelectorComponent = ComponentType<MenuCategorySelectorContent & {
  onSelectCategory?: (categoryId: string) => void;
}>;

export type { MenuCategorySelectorContent, MenuCategorySelectorCategory } from './schema';
