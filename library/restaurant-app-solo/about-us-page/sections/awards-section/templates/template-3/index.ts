import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { AwardsContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Awards Timeline',
  description: 'Grid-based award badge catalogue for timeline or press kit sections.',
  recommendedUse: ['Press sections', 'Investor presentations', 'Menu booklet callouts'],
  tags: ['awards', 'grid'],
});

export const load: SectionVariantLoader<AwardsContent> = async () => ({
  default: (await import('./AwardsTemplateThree')).default,
});

export { default as AwardsTemplateThree } from './AwardsTemplateThree';
