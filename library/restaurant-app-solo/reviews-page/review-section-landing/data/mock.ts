import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { ReviewVariant } from '../types';

import type { ReviewContent } from '../types/schema';

const sampleReviews: ReviewContent['reviews'] = [
  {
    id: 'rev-1',
    authorName: 'Sarah Chen',
    rating: 5,
    comment: 'Absolutely incredible! The coffee is perfectly brewed and the food is outstanding. Cozy atmosphere and attentive staff.',
    publishedAt: '2025-01-12',
  },
  {
    id: 'rev-2',
    authorName: 'Michael Rodriguez',
    rating: 5,
    comment: 'Best breakfast spot in town! Their signature dishes are amazing and the service is always friendly.',
    publishedAt: '2025-02-03',
  },
  {
    id: 'rev-3',
    authorName: 'Emma Thompson',
    rating: 5,
    comment: 'A hidden gem. The quality of food and attention to detail is impressive. Perfect for brunch with friends.',
    publishedAt: '2025-01-28',
  },
  {
    id: 'rev-4',
    authorName: 'David Park',
    rating: 4,
    comment: 'Really enjoyed my visit. Great variety and everything we tried was delicious.',
    publishedAt: '2025-02-10',
  },
  {
    id: 'rev-5',
    authorName: 'Lisa Martinez',
    rating: 5,
    comment: 'My go-to spot for quality food and coffee! The presentation is beautiful and flavours are on point.',
    publishedAt: '2025-01-05',
  },
];

const baseContent: ReviewContent = {
  title: 'What Our Guests Say',
  viewAllHref: '/reviews',
  reviews: sampleReviews,
  avgRating: 4.8,
  totalCount: 128,
};

export const reviewMocks = defineSectionMocks<ReviewVariant, ReviewContent>('Review Section', {
  defaultVariant: 'primary',
  variants: {
    'primary': {
      ...baseContent,
    },
    'classic': {
      ...baseContent,
    },
    'modern': {
      ...baseContent,
      title: 'Guests Love The Experience',
    },
    'minimal': {
      ...baseContent,
      title: 'Guest Feedback',
    },
    'featured': {
      ...baseContent,
      title: 'Top Reviews',
    },
    'testimonial': {
      ...baseContent,
      title: 'Customer Stories',
    },
    'grid': {
      ...baseContent,
      title: 'Real Results, Real Voices',
    },
    'glass-swiper': {
      ...baseContent,
      title: 'Swipe Through Experiences',
    },
    'image-masonry': {
      ...baseContent,
      title: 'What People Are Saying',
    },
    'stagger-cards': {
      ...baseContent,
      title: 'Customer Testimonials',
    },
    'animated-stack': {
      ...baseContent,
      title: 'Trusted by Locals & Travellers',
    },
    'scrolling-columns': {
      ...baseContent,
      title: 'What Our Guests Say',
    },
  },
});

export type ReviewMockKey = keyof typeof reviewMocks;
