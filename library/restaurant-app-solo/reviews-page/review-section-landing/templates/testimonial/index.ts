import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Reviews · Testimonial',
  description: 'Reusable testimonial testimonial variant.',
  recommendedUse: ['Review section'],
  tags: ['reviews'],
});

export const load: SectionVariantLoader<ReviewContent> = async () => ({
  default: (await import('./ReviewTestimonial')).default,
});

export { default as ReviewTestimonial } from './ReviewTestimonial';
