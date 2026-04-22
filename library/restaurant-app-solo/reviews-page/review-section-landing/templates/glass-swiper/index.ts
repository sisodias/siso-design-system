import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Reviews · Glass Swiper',
  description: 'Reusable glass swiper testimonial variant.',
  recommendedUse: ['Review section'],
  tags: ['reviews'],
});

export const load: SectionVariantLoader<ReviewContent> = async () => ({
  default: (await import('./ReviewGlassSwiper')).default,
});

export { default as ReviewGlassSwiper } from './ReviewGlassSwiper';
