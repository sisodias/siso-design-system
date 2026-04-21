import type { ComponentType } from 'react';
import type { InstagramContent } from './schema';

export type InstagramVariant = 'primary';

export interface InstagramRendererProps {
  variant?: InstagramVariant;
  content: InstagramContent;
  fallbackVariant?: InstagramVariant;
}

export type InstagramComponent = ComponentType<InstagramContent>;
