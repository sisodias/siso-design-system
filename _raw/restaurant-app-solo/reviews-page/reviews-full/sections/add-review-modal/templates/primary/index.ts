import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { AddReviewModalComponentProps } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Add Review Modal · Primary',
  description: 'Submission form for authenticated guests with rating picker and validation.',
  recommendedUse: ['Reviews submission workflow', 'Guest feedback capture'],
  tags: ['form', 'modal', 'reviews'],
});

export const load: SectionVariantLoader<AddReviewModalComponentProps> = async () => ({
  default: (await import('./AddReviewModalPrimary')).default,
});

export { default as AddReviewModalPrimary } from './AddReviewModalPrimary';
