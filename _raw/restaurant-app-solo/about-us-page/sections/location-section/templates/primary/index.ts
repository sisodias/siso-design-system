import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { LocationContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Immersive Map + Details',
  description: 'Two-column layout featuring Google Maps embed, contact quick actions, hours, and arrival notes.',
  recommendedUse: [
    'Single-location hospitality brands',
    'When you want quick action buttons for phone/WhatsApp',
    'Best paired with medium-to-long copy directions',
  ],
  tags: ['map', 'contact', 'two-column'],
});

export const load: SectionVariantLoader<LocationContent> = async () => ({
  default: (await import('./LocationPrimary')).default,
});

export { default as LocationPrimary } from './LocationPrimary';
export { LocationContact } from './components/LocationContact';
export type { LocationContactProps } from './components/LocationContact';
