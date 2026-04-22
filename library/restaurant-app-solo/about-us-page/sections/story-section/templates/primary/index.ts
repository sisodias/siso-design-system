import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { StoryContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Milestone Timeline',
  description: 'Vertical timeline with year markers and copy blocks for long-form storytelling.',
  recommendedUse: ['About pages', 'Brand history sections', 'Investor decks'],
  tags: ['timeline', 'narrative'],
});

export const load: SectionVariantLoader<StoryContent> = async () => ({
  default: (await import('./StoryPrimary')).default,
});

export { default as StoryPrimary } from './StoryPrimary';
