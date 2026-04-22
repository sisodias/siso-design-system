import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { CuisinePhilosophyVariant } from '../types';
import type { CuisinePhilosophyContent } from '../types/schema';

export const cuisinePhilosophyMocks = defineSectionMocks<CuisinePhilosophyVariant, CuisinePhilosophyContent>('Cuisine Philosophy Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      title: 'Crafted with Intention',
      subtitle: 'Every plate tells a story',
      introduction: 'We blend local ingredients with global techniques to create flavours that comfort and surprise.',
      philosophyPoints: [
        {
          id: 'local',
          icon: 'leaf',
          title: 'Locally Sourced',
          description: 'We partner with farmers across Bali for organic produce harvested at peak freshness.',
        },
        {
          id: 'fire',
          icon: 'flame',
          title: 'Wood-Fired Mastery',
          description: 'Signature dishes are finished over rambutan wood to draw out natural sweetness.',
        },
        {
          id: 'heart',
          icon: 'heart',
          title: 'Hospitality First',
          description: 'Menus are designed to share—every table becomes a gathering.',
        },
        {
          id: 'award',
          icon: 'award',
          title: 'Award-Winning Plates',
          description: 'Recognised by Bali Taste Awards for innovation in regional cuisine.',
        },
      ],
    },
    'template-2': {
      title: 'Our Kitchen Pillars',
      subtitle: 'Four cornerstones',
      introduction: 'High-level snapshot for condensed layouts.',
      philosophyPoints: [
        { id: 'seasonal', icon: 'leaf', title: 'Seasonal First', description: 'Menus rotate with the harvest.' },
        { id: 'technique', icon: 'flame', title: 'Technique Driven', description: 'Sous-vide meets satay smoke.' },
      ],
    },
    'template-3': {
      title: 'Sustainably Crafted',
      subtitle: 'Philosophy in motion',
      introduction: 'Use for visual timelines or sliders once design is finalised.',
      philosophyPoints: [
        { id: 'community', icon: 'heart', title: 'Community Support', description: '1% of revenue funds food education programmes.' },
      ],
    },
  },
});

export type CuisinePhilosophyMockKey = keyof typeof cuisinePhilosophyMocks;
