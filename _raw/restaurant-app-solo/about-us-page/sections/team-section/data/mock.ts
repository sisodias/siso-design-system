import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { TeamVariant } from '../types';
import type { TeamContent } from '../types/schema';

export const teamMocks = defineSectionMocks<TeamVariant, TeamContent>('Team Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      title: 'Meet Our Team',
      subtitle: 'Hospitality experts with a passion for flavour',
      members: [
        {
          id: 'maria',
          name: 'Chef Maria Rodriguez',
          role: 'Founder & Master Chef',
          bio: '30+ years crafting Indonesian cuisine with modern twists.',
          imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80&auto=format&fit=crop',
        },
        {
          id: 'indra',
          name: 'Indra Mahendra',
          role: 'Head Roaster',
          bio: 'Leads our single-origin roasting program and seasonal blends.',
          imageUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&q=80&auto=format&fit=crop',
        },
        {
          id: 'sasha',
          name: 'Sasha Liu',
          role: 'Beverage Director',
          bio: 'Designs the cocktail menu inspired by Bali botanicals.',
        },
      ],
    },
    'template-2': {
      title: 'Kitchen Leads',
      subtitle: 'Culinary minds working the pass',
      members: [
        {
          id: 'eko',
          name: 'Eko Pradana',
          role: 'Sous Chef',
          bio: 'Keeps service smooth and ensures flavours stay balanced.',
        },
        {
          id: 'noor',
          name: 'Noor Rahman',
          role: 'Pastry Lead',
          bio: 'Signature desserts champion local cacao and vanilla.',
        },
      ],
    },
    'template-3': {
      title: 'Backstage Crew',
      subtitle: 'Placeholder – swap with final UI',
      members: [
        {
          id: 'placeholder',
          name: 'Team Draco',
          role: 'Story pending',
          bio: 'Replace with final component before launch.',
        },
      ],
    },
  },
});

export type TeamMockKey = keyof typeof teamMocks;
