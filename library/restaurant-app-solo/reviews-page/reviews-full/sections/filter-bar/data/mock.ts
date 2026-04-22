import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { FilterBarVariant } from '../types';
import type { FilterBarContent } from '../types/schema';

export const filterBarMocks = defineSectionMocks<FilterBarVariant, FilterBarContent>('Filter Bar Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      totalReviews: 186,
      ratingBreakdown: {
        5: 154,
        4: 22,
        3: 7,
        2: 2,
        1: 1,
      },
    },
  },
});

export type FilterBarMockKey = keyof typeof filterBarMocks;
