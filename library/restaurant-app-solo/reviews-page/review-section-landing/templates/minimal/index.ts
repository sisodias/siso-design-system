import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Reviews · Minimal',
  description: 'Reusable minimal testimonial variant.',
  recommendedUse: ['Review section'],
  tags: ['reviews'],
});

export const load: SectionVariantLoader<ReviewContent> = async () => ({
  default: (await import('./ReviewMinimal')).default,
});

export { default as ReviewMinimal } from './ReviewMinimal';
