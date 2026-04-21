import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { VenueGalleryContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Venue Gallery Placeholder',
  description: 'Intentional placeholder until a 21st.dev gallery template lands.',
  recommendedUse: ['Mocks only', 'Signals engineers to drop in future component'],
  tags: ['placeholder', 'todo'],
});

export const load: SectionVariantLoader<VenueGalleryContent> = async () => ({
  default: (await import('./VenueGalleryTemplate3')).default,
});

export { default as VenueGalleryTemplate3 } from './VenueGalleryTemplate3';
