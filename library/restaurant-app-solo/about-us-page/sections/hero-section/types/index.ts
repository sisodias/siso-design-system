import type { ComponentType } from 'react';
import type { HeroContent } from './schema';

export type HeroVariant = 'primary' | 'template-2' | 'template-3';

export interface HeroRendererProps {
  variant?: HeroVariant;
  content: HeroContent;
  /** Fallback variant when a specific key is unavailable. Defaults to `primary`. */
  fallbackVariant?: HeroVariant;
}

export type HeroComponent = ComponentType<HeroContent>;

export interface HeroVariantDefinition {
  key: HeroVariant;
  label: string;
  description: string;
  screenshot?: string;
  storyId?: string;
  supports?: Record<string, boolean>;
}
