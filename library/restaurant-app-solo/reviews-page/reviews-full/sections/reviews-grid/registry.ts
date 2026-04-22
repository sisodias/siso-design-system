import type { ReviewsGridVariant, ReviewsGridComponent, ReviewsGridComponentProps } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as ReviewsGridPrimaryMetadata, ReviewsGridPrimary } from './templates/primary';

export const reviewsGridRegistry = createSectionRegistry<ReviewsGridVariant, ReviewsGridComponentProps>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: ReviewsGridPrimaryMetadata.name,
      description: ReviewsGridPrimaryMetadata.description,
      screenshot: ReviewsGridPrimaryMetadata.screenshot,
      tags: ReviewsGridPrimaryMetadata.tags,
      load: async () => ({ default: ReviewsGridPrimary }),
    },
  },
});

const components: Record<ReviewsGridVariant, ReviewsGridComponent> = {
  primary: ReviewsGridPrimary,
};

export function getReviewsGridVariant(variant: string | undefined): ReviewsGridVariant {
  return resolveVariant(variant, reviewsGridRegistry);
}

export function getReviewsGridComponent(variant: ReviewsGridVariant) {
  return components[variant];
}

export function listReviewsGridVariants() {
  return listVariants(reviewsGridRegistry);
}
