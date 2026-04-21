import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ReviewCardContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Review Card · Noir',
  description: 'High-contrast review card ideal for dark surfaces and nightlife concepts.',
  recommendedUse: ['Dark-themed reviews pages', 'High-contrast hero overlays'],
  tags: ['reviews', 'dark-mode', 'social-proof'],
});

export const load: SectionVariantLoader<ReviewCardContent> = async () => ({
  default: (await import('./ReviewCardNoir')).default,
});

export { default as ReviewCardNoir } from './ReviewCardNoir';
