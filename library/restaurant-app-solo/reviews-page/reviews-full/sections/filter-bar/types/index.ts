import type { ComponentType } from 'react';
import type { FilterBarContent } from './schema';

export type FilterBarVariant = 'primary';

export interface FilterBarRendererProps {
  variant?: FilterBarVariant;
  content: FilterBarContent;
  fallbackVariant?: FilterBarVariant;
}

export type FilterBarComponent = ComponentType<FilterBarContent>;

export type { FilterBarContent } from './schema';
