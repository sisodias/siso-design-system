import type { ComponentType } from 'react';
import type { ValuesContent } from './schema';

export type ValuesVariant = 'primary' | 'template-2' | 'template-3';

export interface ValuesRendererProps {
  variant?: ValuesVariant;
  content: ValuesContent;
  fallbackVariant?: ValuesVariant;
}

export type ValuesComponent = ComponentType<ValuesContent>;
export type { ValuesContent, ValuesItem, ValuesIcon } from './schema';
