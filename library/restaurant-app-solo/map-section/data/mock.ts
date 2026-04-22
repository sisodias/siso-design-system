import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { MapVariant } from '../types';
import type { MapContent } from '../types/schema';

export const mapMocks = defineSectionMocks<MapVariant, MapContent>('Map Section', {
  defaultVariant: 'primary',
  variants: {
    'primary': {
      address: 'Jl. Raya Seminyak No. 21, Badung, Bali',
      label: 'Open daily · 8 AM – 10 PM',
      iframeTitle: 'Draco Coffee on Google Maps',
    },
  },
});

export type MapMockKey = keyof typeof mapMocks;
