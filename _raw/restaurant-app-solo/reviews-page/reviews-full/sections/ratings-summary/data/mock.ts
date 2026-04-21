import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { RatingsSummaryVariant } from '../types';
import type { RatingsSummaryContent } from '../types/schema';

export const ratingsSummaryMocks = defineSectionMocks<RatingsSummaryVariant, RatingsSummaryContent>(
  'Ratings Summary Section',
  {
    defaultVariant: 'primary',
    variants: {
      primary: {
        stats: {
          average: 4.8,
          total: 186,
          breakdown: {
            '5_stars': 154,
            '4_stars': 22,
            '3_stars': 7,
            '2_stars': 2,
            '1_star': 1,
          },
        },
        featuredTags: ['Signature cocktails', 'Friendly staff', 'Brunch vibes', 'Cozy atmosphere'],
      },
    },
  }
);

export type RatingsSummaryMockKey = keyof typeof ratingsSummaryMocks;
