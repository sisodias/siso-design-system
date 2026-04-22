import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { VenueGalleryContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Masonry Lightbox Gallery',
  description: 'Masonry grid with category filters and lightbox modal for detail views.',
  recommendedUse: [
    'Ideal when you have 6+ images spanning multiple categories',
    'Best for showcasing venue interiors and atmosphere',
    'Supports optional CTA below the gallery',
  ],
  tags: ['masonry', 'lightbox', 'filters'],
});

export const load: SectionVariantLoader<VenueGalleryContent> = async () => ({
  default: (await import('./VenueGalleryPrimary')).default,
});

export { default as VenueGalleryPrimary } from './VenueGalleryPrimary';
export { VenueGallery } from './components/VenueGallery';
export type { VenueGalleryProps, GalleryImage } from './components/VenueGallery';
