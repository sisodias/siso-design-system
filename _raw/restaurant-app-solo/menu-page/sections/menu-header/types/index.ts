import type { ComponentType } from 'react';
import type { MenuHeaderContent } from './schema';


export type MenuHeaderVariant = 'primary';

export interface MenuHeaderRendererProps {
  variant?: MenuHeaderVariant;
  content: MenuHeaderContent;
  fallbackVariant?: MenuHeaderVariant;
}

export type MenuHeaderComponent = ComponentType<MenuHeaderContent>;

export type { MenuHeaderContent, MenuHeaderCTA } from './schema';
