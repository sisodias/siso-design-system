import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ValuesContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Editorial Spotlight',
  description: 'Magazine-inspired split layout that spotlights a hero value and supporting principles.',
  recommendedUse: [
    'When one cultural pillar deserves emphasis',
    'Pairs well with long-form storytelling',
    'Use when you need rich supporting copy',
  ],
  tags: ['editorial', 'split-layout', 'spotlight'],
});

export const load: SectionVariantLoader<ValuesContent> = async () => ({
  default: (await import('./ValuesTemplate2')).default,
});

export { default as ValuesTemplate2 } from './ValuesTemplate2';
