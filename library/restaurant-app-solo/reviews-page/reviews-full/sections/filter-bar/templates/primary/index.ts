import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { FilterBarContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Filter Bar · Primary',
  description: 'Interactive filter sidebar with rating, source, feature, and sort controls.',
  recommendedUse: ['Reviews page sidebar', 'Testimonials filtering experiences'],
  tags: ['filters', 'controls', 'reviews'],
});

export const load: SectionVariantLoader<FilterBarContent> = async () => ({
  default: (await import('./FilterBarPrimary')).default,
});

export { default as FilterBarPrimary } from './FilterBarPrimary';
