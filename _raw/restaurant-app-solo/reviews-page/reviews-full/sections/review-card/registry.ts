import type { ReviewCardVariant, ReviewCardComponent, ReviewCardComponentProps } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import {
  metadata as ReviewCardPrimaryMetadata,
  ReviewCardPrimary,
} from './templates/primary';
import { metadata as ReviewCardNoirMetadata, ReviewCardNoir } from './templates/noir';

export const reviewCardRegistry = createSectionRegistry<ReviewCardVariant, ReviewCardComponentProps>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: ReviewCardPrimaryMetadata.name,
      description: ReviewCardPrimaryMetadata.description,
      screenshot: ReviewCardPrimaryMetadata.screenshot,
      tags: ReviewCardPrimaryMetadata.tags,
      load: async () => ({ default: ReviewCardPrimary }),
    },
    'noir': {
      label: ReviewCardNoirMetadata.name,
      description: ReviewCardNoirMetadata.description,
      screenshot: ReviewCardNoirMetadata.screenshot,
      tags: ReviewCardNoirMetadata.tags,
      load: async () => ({ default: ReviewCardNoir }),
    },
  },
});

const components: Record<ReviewCardVariant, ReviewCardComponent> = {
  primary: ReviewCardPrimary,
  noir: ReviewCardNoir,
};

export function getReviewCardVariant(variant: string | undefined): ReviewCardVariant {
  return resolveVariant(variant, reviewCardRegistry);
}

export function getReviewCardComponent(variant: ReviewCardVariant) {
  return components[variant];
}

export function listReviewCardVariants() {
  return listVariants(reviewCardRegistry);
}
