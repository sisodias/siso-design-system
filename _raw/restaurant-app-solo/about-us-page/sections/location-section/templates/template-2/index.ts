import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { LocationContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Concierge Column Layout',
  description: 'Editorial layout with sticky map preview and concierge-style contact + hours column.',
  recommendedUse: [
    'Great for longer operating hour schedules',
    'Use when parking or arrival notes matter',
    'Ideal for venues hosting reservations',
  ],
  tags: ['editorial', 'map', 'sticky'],
});

export const load: SectionVariantLoader<LocationContent> = async () => ({
  default: (await import('./LocationTemplate2')).default,
});

export { default as LocationTemplate2 } from './LocationTemplate2';
