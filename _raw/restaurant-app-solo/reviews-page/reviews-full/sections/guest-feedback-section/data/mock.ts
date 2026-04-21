import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { GuestFeedbackVariant } from '../types';
import type { GuestFeedbackContent } from '../types/schema';

export const guestFeedbackMocks = defineSectionMocks<GuestFeedbackVariant, GuestFeedbackContent>(
  'Guest Feedback Section',
  {
    defaultVariant: 'primary',
    variants: {
      primary: {
        heading: {
          title: 'What Our Guests Are Saying',
          subtitle: 'Real stories from Draco Coffee & Eatery regulars',
          pillText: 'Guest Feedback',
        },
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
        filters: {
          totalReviews: 186,
          ratingBreakdown: {
            5: 154,
            4: 22,
            3: 7,
            2: 2,
            1: 1,
          },
        },
        reviews: [
          {
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
          {
            id: 'devon-reid',
            authorName: 'Devon Reid',
            rating: 5,
            comment:
              'The tasting menu was phenomenal—local ingredients elevated with modern techniques. Worth every rupiah.',
            publishedAt: '2025-08-22T10:05:00.000Z',
            source: 'Website',
            verified: true,
            featured: false,
            images: [],
            ownerResponse: null,
            ownerRespondedAt: null,
            helpfulCount: 18,
            metadata: {
              highlights: ['Tasting menu', 'Seasonal produce'],
            },
          },
          {
            id: 'shanice-hart',
            authorName: 'Shanice Hart',
            rating: 4,
            comment:
              'Loved the plant-based options and mocktails. Service was so warm and welcoming—will definitely return.',
            publishedAt: '2025-07-11T08:45:00.000Z',
            source: 'Google Maps',
            verified: false,
            featured: false,
            images: ['/images/tenants/draco/reviews/mocktails.jpg', '/images/tenants/draco/reviews/dessert.jpg'],
            ownerResponse: null,
            ownerRespondedAt: null,
            helpfulCount: 9,
            metadata: {
              highlights: ['Plant-based menu', 'Mocktails'],
            },
          },
        ],
        viewer: {
          isAuthenticated: false,
          userName: null,
        },
      },
    },
  }
);

export type GuestFeedbackMockKey = keyof typeof guestFeedbackMocks;
