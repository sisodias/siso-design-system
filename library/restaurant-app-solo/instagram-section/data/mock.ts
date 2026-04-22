import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { InstagramVariant } from '../types';
import type { InstagramContent } from '../types/schema';

export const instagramMocks = defineSectionMocks<InstagramVariant, InstagramContent>('Instagram Section', {
  defaultVariant: 'primary',
  variants: {
    'primary': {
      instagramHandle: '@dracocoffee',
      instagramUrl: 'https://instagram.com/dracocoffee',
      incentiveText: 'Follow for new signature drinks & soft launch invites.',
      followerBadge: 'Join 8,200+ locals already following us',
      images: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
      ],
    },
  },
});

export type InstagramMockKey = keyof typeof instagramMocks;
