import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { AwardsContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Awards & Social Proof',
  description: 'Hero-style rating card with testimonials and achievement badges for deep trust building.',
  recommendedUse: ['Showcase review scores', 'Highlight award badges', 'Support conversion-focused pages'],
  tags: ['social-proof', 'testimonials', 'awards'],
});

export const load: SectionVariantLoader<AwardsContent> = async () => ({
  default: (await import('./AwardsPrimary')).default,
});

export { default as AwardsPrimary } from './AwardsPrimary';
