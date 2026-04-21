import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Reviews · Stagger Cards',
  description: 'Reusable stagger cards testimonial variant.',
  recommendedUse: ['Review section'],
  tags: ['reviews'],
});

export const load: SectionVariantLoader<ReviewContent> = async () => ({
  default: (await import('./ReviewStaggerCards')).default,
});

export { default as ReviewStaggerCards } from './ReviewStaggerCards';
