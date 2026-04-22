import { defineSectionMocks } from '@/domains/shared/section-tools';
import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { ImageLightboxVariant } from '../types';
import type { ImageLightboxContent } from '../types/schema';

export const imageLightboxMocks = defineSectionMocks<ImageLightboxVariant, ImageLightboxContent>(
  'Image Lightbox Section',
  {
    defaultVariant: 'primary',
    variants: {
      primary: {
        images: ['/images/tenants/draco/reviews/mocktails.jpg', '/images/tenants/draco/reviews/dessert.jpg'],
        currentIndex: 0,
      },
    },
  }
);

export type ImageLightboxMockKey = keyof typeof imageLightboxMocks;
