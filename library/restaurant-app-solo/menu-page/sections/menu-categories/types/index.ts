import type { ComponentType } from 'react';
import type { MenuCategoriesContent } from './schema';

export type MenuCategoriesVariant = 'primary';

export interface MenuCategoriesRendererProps {
  variant?: MenuCategoriesVariant;
  content: MenuCategoriesContent;
  fallbackVariant?: MenuCategoriesVariant;
}

export type MenuCategoriesComponent = ComponentType<MenuCategoriesContent>;

export type {
  MenuCategoriesContent,
  MenuCategoriesAbout,
  MenuCategoryItem,
  MenuCategorySummary,
} from './schema';
