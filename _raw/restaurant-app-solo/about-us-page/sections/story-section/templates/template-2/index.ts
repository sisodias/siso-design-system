import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { StoryContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Milestone Cards',
  description: 'Card-based layout that highlights key chapters in a two-column grid.',
  recommendedUse: ['Executive summaries', 'Landing sections', 'Email-friendly recaps'],
  tags: ['cards', 'milestones'],
});

export const load: SectionVariantLoader<StoryContent> = async () => ({
  default: (await import('./StoryTemplate2')).default,
});

export { default as StoryTemplate2 } from './StoryTemplate2';
