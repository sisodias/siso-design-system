import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewsGridComponentProps } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Reviews Grid · Primary',
  description: 'Two-column card layout with photo lightbox and helpful voting.',
  recommendedUse: ['Reviews page main content', 'Testimonials section with images'],
  tags: ['reviews', 'cards', 'social-proof'],
});

export const load: SectionVariantLoader<ReviewsGridComponentProps> = async () => ({
  default: (await import('./ReviewsGridPrimary')).default,
});

export { default as ReviewsGridPrimary } from './ReviewsGridPrimary';
