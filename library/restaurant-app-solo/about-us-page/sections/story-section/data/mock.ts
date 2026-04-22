import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { StoryVariant } from '../types';
import type { StoryContent } from '../types/schema';

export const storyMocks = defineSectionMocks<StoryVariant, StoryContent>('Story Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      title: 'A Journey Brewed Over Decades',
      subtitle: 'Key milestones from humble roastery to destination cafe',
      milestones: [
        {
          id: '1989',
          year: '1989',
          title: 'Origins in Bandung',
          description: 'Our founder learned slow-roasting techniques from local artisans and began sourcing micro-lot beans.',
        },
        {
          id: '2002',
          year: '2002',
          title: 'First Beachfront Cafe',
          description: 'Opened a 40-seat cafe in Seminyak with a menu pairing Javanese flavors and specialty coffee.',
        },
        {
          id: '2016',
          year: '2016',
          title: 'Signature Cold Brew Launch',
          description: 'Introduced the Draco cold brew program and earned national recognition for innovation.',
        },
        {
          id: '2024',
          year: '2024',
          title: 'Sustainable Farm Collective',
          description: 'Partnered with Bali growers to guarantee fair trade pricing and zero-waste packaging.',
        },
      ],
    },
    'template-2': {
      title: 'Highlights at a Glance',
      subtitle: 'Four pivotal chapters',
      milestones: [
        {
          id: 'launch',
          year: '2010',
          title: 'Launch',
          description: 'Opened doors with a four-person crew and a single La Marzocco Linea.',
        },
        {
          id: 'expansion',
          year: '2015',
          title: 'Expansion',
          description: 'Second location debuts with open-kitchen dining and mixology lab.',
        },
        {
          id: 'award',
          year: '2020',
          title: 'Award',
          description: 'Named Best Cafe in Bali by Southeast Asia Eats.',
        },
        {
          id: 'future',
          year: '2026',
          title: 'Future',
          description: 'Plan to launch a roasting academy and community education center.',
        },
      ],
    },
    'template-3': {
      title: 'Origins & Evolution',
      subtitle: 'Three act story arc',
      milestones: [
        {
          id: 'roots',
          year: 'Chapter I',
          title: 'Roots',
          description: 'Family recipes and market pop-ups introduce our signature sambal.',
        },
        {
          id: 'growth',
          year: 'Chapter II',
          title: 'Growth',
          description: 'Expanded into nightlife with coffee cocktails and live sessions.',
        },
        {
          id: 'legacy',
          year: 'Chapter III',
          title: 'Legacy',
          description: 'Committed to regenerative farming and culinary mentorship.',
        },
      ],
    },
  },
});

export type StoryMockKey = keyof typeof storyMocks;
