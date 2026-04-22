import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { AwardsVariant } from '../types';
import type { AwardsContent } from '../types/schema';

export const awardsMocks = defineSectionMocks<AwardsVariant, AwardsContent>('Awards Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      title: 'Loved by Our Community',
      subtitle: 'See what loyal guests are sharing online',
      googleRating: {
        score: 4.8,
        totalReviews: 186,
        source: 'Google',
      },
      testimonials: [
        {
          id: 'amelia-tan',
          name: 'Amelia Tan',
          rating: 5,
          text: 'The espresso martinis are unreal and the staff remember my order every visit. Easily my go-to spot in Seminyak.',
          date: 'March 2025',
          platform: 'Google',
        },
        {
          id: 'devon-reid',
          name: 'Devon Reid',
          rating: 5,
          text: 'Tasting menu was a masterclass—local ingredients elevated with modern techniques. Worth every rupiah.',
          date: 'February 2025',
          platform: 'TripAdvisor',
        },
        {
          id: 'shanice-hart',
          name: 'Shanice Hart',
          rating: 4,
          text: 'Loved the plant-based options and the mocktail list. Service was so warm and welcoming.',
          date: 'January 2025',
        },
      ],
      achievements: [
        {
          id: 'best-cafe-2024',
          icon: 'award',
          title: 'Best Cafe 2024',
          description: 'Bali Hospitality Awards – People’s Choice Winner',
        },
        {
          id: 'top-trending',
          icon: 'trending',
          title: 'Trending Destination',
          description: 'Top 10 brunch spots on EatTravel Magazine',
        },
        {
          id: 'community-favorite',
          icon: 'users',
          title: 'Community Favorite',
          description: 'Rated 4.8+ for six consecutive quarters',
        },
        {
          id: 'five-star-club',
          icon: 'star',
          title: 'Five-Star Club',
          description: '150+ five-star reviews across platforms',
        },
      ],
      compact: false,
    },
    'template-2': {
      title: 'Guest Spotlight',
      subtitle: 'Quick snapshot of our latest fan-favorite review',
      testimonials: [
        {
          id: 'hana-lee',
          name: 'Hana Lee',
          rating: 5,
          text: 'Seasonal tasting flight was phenomenal—every pour told a story.',
          date: 'April 2025',
        },
      ],
      compact: true,
    },
    'template-3': {
      title: 'Awards & Accolades',
      subtitle: 'Highlights from the past year',
      achievements: [
        {
          id: 'michelin-mention',
          icon: 'award',
          title: 'Michelin Guide Bali Mention',
          description: 'Recognised for outstanding coffee program',
        },
        {
          id: 'travel-mag',
          icon: 'trending',
          title: 'Travel Mag Must-Visit',
          description: 'Top 5 brunch spots 2025 list',
        },
      ],
    },
  },
});

export type AwardsMockKey = keyof typeof awardsMocks;
