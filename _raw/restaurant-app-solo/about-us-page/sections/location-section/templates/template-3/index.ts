import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { LocationContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Location Placeholder',
  description: 'Deliberately empty until a custom 21st.dev variant lands.',
  recommendedUse: ['Use only as a placeholder in mocks'],
  tags: ['placeholder', 'todo'],
});

export const load: SectionVariantLoader<LocationContent> = async () => ({
  default: (await import('./LocationTemplate3')).default,
});

export { default as LocationTemplate3 } from './LocationTemplate3';
