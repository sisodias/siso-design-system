import { defineSectionMocks } from '@/domains/shared/section-tools';
import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { AddReviewModalVariant } from '../types';
import type { AddReviewModalContent } from '../types/schema';

export const addReviewModalMocks = defineSectionMocks<AddReviewModalVariant, AddReviewModalContent>(
  'Add Review Modal Section',
  {
    defaultVariant: 'primary',
    variants: {
      primary: {
        userName: 'Amelia',
        isAuthenticated: true,
      },
    },
  }
);

export type AddReviewModalMockKey = keyof typeof addReviewModalMocks;
