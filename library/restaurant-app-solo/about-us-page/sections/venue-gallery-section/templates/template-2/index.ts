import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { VenueGalleryContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Immersive Auto Slider',
  description: 'Infinite auto-scrolling gallery framed with editorial copy.',
  recommendedUse: [
    'Hero-level imagery that deserves motion',
    'Trade shows or website sections needing high energy visuals',
    'Perfect when categories are optional but helpful as badges',
  ],
  tags: ['slider', 'motion', 'immersive'],
});

export const load: SectionVariantLoader<VenueGalleryContent> = async () => ({
  default: (await import('./VenueGalleryTemplate2')).default,
});

export { default as VenueGalleryTemplate2 } from './VenueGalleryTemplate2';
