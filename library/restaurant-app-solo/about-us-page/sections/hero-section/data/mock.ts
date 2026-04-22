import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { HeroVariant } from '../types';
import type { HeroContent } from '../types/schema';

export const heroMocks = defineSectionMocks<HeroVariant, HeroContent>('Hero Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      pillText: 'Our Story',
      title: 'Savor Bali’s energy, one cup at a time.',
      subtitle: 'Neighborhood coffee, late-night plates, and a community powered by bold flavor.',
      description:
        'Born in Denpasar in 2020, Draco Coffee & Eatery celebrates Indonesian staples, vinyl-laced evenings, and connections that linger long after the last sip.',
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90&auto=format&fit=crop',
      primaryCta: {
        label: 'Book a Visit',
        href: '#location',
        style: 'primary',
      },
      secondaryCta: {
        label: 'Meet the Team',
        href: '#team',
        style: 'secondary',
      },
      metaBadges: [
        { id: 'founded', label: 'Since', value: '2020' },
        { id: 'hours', label: 'Open Until', value: '23:00' },
        { id: 'rating', label: 'Guest Rating', value: '4.6 ★' },
        { id: 'experience', label: 'Experience', value: 'Vinyl Nights' },
      ],
    },
    'template-2': {
      title: 'Where Taste Meets Tradition',
      subtitle: 'Three decades of craftsmanship in every cup',
      description: 'Explore seasonal highlights, signature drinks, and the people who make them unforgettable.',
      imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1920&q=90&auto=format&fit=crop',
    },
    'template-3': {
      title: 'Rooted in Community',
      subtitle: 'Hospitality that feels like home',
      description: 'Small-batch roasting, locally sourced ingredients, and a team that treats every guest like family.',
      imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1920&q=90&auto=format&fit=crop',
    },
  },
});

export type HeroMockKey = keyof typeof heroMocks;
