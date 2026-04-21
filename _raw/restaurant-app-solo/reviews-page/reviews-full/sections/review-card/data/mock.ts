import { defineSectionMocks } from '@/domains/shared/section-tools';
import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { ReviewCardVariant } from '../types';
import type { ReviewCardContent } from '../types/schema';

export const reviewCardMocks = defineSectionMocks<ReviewCardVariant, ReviewCardContent>('Review Card Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      id: 'amelia-tan',
      authorName: 'Amelia Tan',
      rating: 5,
      comment:
        'The espresso martinis are unreal and the staff always remember my order. Draco is my go-to spot in Seminyak.',
      publishedAt: '2025-09-14T18:32:00.000Z',
      source: 'Google Maps',
      verified: true,
      featured: true,
      images: ['/images/tenants/draco/reviews/espresso.jpg'],
      ownerResponse:
        'Thank you, Amelia! We saved a seat at the bar for your next visit—espresso martini on us.',
      ownerRespondedAt: '2025-09-15T06:12:00.000Z',
      helpfulCount: 42,
      metadata: {
        highlights: ['Espresso martinis', 'Friendly staff', 'Late-night ambience'],
      },
    },
  },
});

export type ReviewCardMockKey = keyof typeof reviewCardMocks;
