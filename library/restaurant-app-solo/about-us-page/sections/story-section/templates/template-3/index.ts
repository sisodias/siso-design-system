import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { StoryContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Story Arc',
  description: 'Three-act progression with numbered waypoints and supporting copy.',
  recommendedUse: ['Brand narrative decks', 'Pitch collateral', 'Experience walkthroughs'],
  tags: ['story-arc', 'steps'],
});

export const load: SectionVariantLoader<StoryContent> = async () => ({
  default: (await import('./StoryTemplate3')).default,
});

export { default as StoryTemplate3 } from './StoryTemplate3';
