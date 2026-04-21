import type { ComponentType } from 'react';
import type { FaqContent } from './schema';

export type FaqVariant = 'primary' | 'template-2' | 'template-3';

export interface FaqRendererProps {
  variant?: FaqVariant;
  content: FaqContent;
  fallbackVariant?: FaqVariant;
}

export type FaqComponent = ComponentType<FaqContent>;
export type { FaqContent, FaqItem, FaqCategory, FaqCta } from './schema';
