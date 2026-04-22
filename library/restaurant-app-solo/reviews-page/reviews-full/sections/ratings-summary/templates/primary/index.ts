import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { RatingsSummaryComponentProps } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Ratings Summary · Primary',
  description: 'Statistics header with aggregate rating, distribution bars, and featured tags.',
  recommendedUse: ['Standalone reviews page', 'Social proof callout sections'],
  tags: ['ratings', 'metrics', 'social-proof'],
});

export const load: SectionVariantLoader<RatingsSummaryComponentProps> = async () => ({
  default: (await import('./RatingsSummaryPrimary')).default,
});

export { default as RatingsSummaryPrimary } from './RatingsSummaryPrimary';
