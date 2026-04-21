import type { RatingsSummaryVariant, RatingsSummaryComponent, RatingsSummaryComponentProps } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as RatingsSummaryPrimaryMetadata, RatingsSummaryPrimary } from './templates/primary';

export const ratingsSummaryRegistry = createSectionRegistry<RatingsSummaryVariant, RatingsSummaryComponentProps>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: RatingsSummaryPrimaryMetadata.name,
      description: RatingsSummaryPrimaryMetadata.description,
      screenshot: RatingsSummaryPrimaryMetadata.screenshot,
      tags: RatingsSummaryPrimaryMetadata.tags,
      load: async () => ({ default: RatingsSummaryPrimary }),
    },
  },
});

const components: Record<RatingsSummaryVariant, RatingsSummaryComponent> = {
  primary: RatingsSummaryPrimary,
};

export function getRatingsSummaryVariant(variant: string | undefined): RatingsSummaryVariant {
  return resolveVariant(variant, ratingsSummaryRegistry);
}

export function getRatingsSummaryComponent(variant: RatingsSummaryVariant) {
  return components[variant];
}

export function listRatingsSummaryVariants() {
  return listVariants(ratingsSummaryRegistry);
}
