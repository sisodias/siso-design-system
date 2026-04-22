import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewCardComponentProps } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Review Card · Gradient Primary',
  description: 'Glassmorphic testimonial card with highlights, owner response, and helpful vote controls.',
  recommendedUse: ['Reviews grid', 'Featured testimonials'],
  tags: ['card', 'testimonial', 'social-proof'],
});

export const load: SectionVariantLoader<ReviewCardComponentProps> = async () => ({
  default: (await import('./ReviewCardPrimary')).default,
});

export { default as ReviewCardPrimary } from './ReviewCardPrimary';
