import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Reviews · Image Masonry',
  description: 'Reusable image masonry testimonial variant.',
  recommendedUse: ['Review section'],
  tags: ['reviews'],
});

export const load: SectionVariantLoader<ReviewContent> = async () => ({
  default: (await import('./ReviewImageMasonry')).default,
});

export { default as ReviewImageMasonry } from './ReviewImageMasonry';
