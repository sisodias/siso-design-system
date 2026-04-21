import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { FaqContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Editorial FAQ Breakdown',
  description: 'Spotlights a hero question with supporting accordion in a two-column editorial frame.',
  recommendedUse: [
    'Great for marketing landing pages needing a hero answer',
    'Use when you want to surface category counts',
    'Pairs nicely with CTA buttons to live support',
  ],
  tags: ['editorial', 'two-column', 'highlight'],
});

export const load: SectionVariantLoader<FaqContent> = async () => ({
  default: (await import('./FaqTemplate2')).default,
});

export { default as FaqTemplate2 } from './FaqTemplate2';
