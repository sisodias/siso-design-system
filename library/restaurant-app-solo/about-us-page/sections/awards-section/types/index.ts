import type { ComponentType } from 'react';
import type {
  AwardsContent,
  AwardsGoogleRating,
  CustomerTestimonial,
  AchievementBadge,
} from './schema';

export type AwardsVariant = 'primary' | 'template-2' | 'template-3';

export interface AwardsRendererProps {
  variant?: AwardsVariant;
  content: AwardsContent;
  fallbackVariant?: AwardsVariant;
}

export type AwardsComponent = ComponentType<AwardsContent>;

export type {
  AwardsContent,
  AwardsGoogleRating,
  CustomerTestimonial,
  AchievementBadge,
} from './schema';
