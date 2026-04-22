import type { ComponentType } from 'react';
import type { ReviewContent } from './schema';

export type ReviewVariant = 'primary' | 'classic' | 'modern' | 'minimal' | 'featured' | 'testimonial' | 'grid' | 'glass-swiper' | 'image-masonry' | 'stagger-cards' | 'animated-stack' | 'scrolling-columns';

export interface ReviewRendererProps {
  variant?: ReviewVariant;
  content: ReviewContent;
  fallbackVariant?: ReviewVariant;
}

export type ReviewComponent = ComponentType<ReviewContent>;
