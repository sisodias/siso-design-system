import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { TeamContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Team Narrative Strip',
  description: 'Placeholder layout for future timelines or sliders.',
  recommendedUse: ['Animated concepts', 'Storytelling variants'],
  tags: ['placeholder'],
});

export const load: SectionVariantLoader<TeamContent> = async () => ({
  default: (await import('./TeamTemplate3')).default,
});

export { default as TeamTemplate3 } from './TeamTemplate3';
