import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { MapContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Map · Embedded Google Map',
  description: 'Framed Google Maps embed with optional custom label and safe referrer settings.',
  recommendedUse: ['Location/contact blocks', 'Footer logistics', 'Mobile friendly map sections'],
  tags: ['map', 'location', 'iframe'],
});

export const load: SectionVariantLoader<MapContent> = async () => ({
  default: (await import('./MapPrimary')).default,
});

export { default as MapPrimary } from './MapPrimary';
