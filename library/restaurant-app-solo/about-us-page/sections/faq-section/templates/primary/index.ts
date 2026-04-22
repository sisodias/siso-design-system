import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { FaqContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Chat Accordion',
  description: 'Category-aware FAQ with chat-style accordion and optional CTA.',
  recommendedUse: [
    'Ideal when you need category filters',
    'Use when answers can leverage the chat accordion styling',
    'Pairs well with timestamped support updates',
  ],
  tags: ['accordion', 'chat', 'filters'],
});

export const load: SectionVariantLoader<FaqContent> = async () => ({
  default: (await import('./FaqPrimary')).default,
});

export { default as FaqPrimary } from './FaqPrimary';
export { FAQSection } from './components/FAQSection';
export type { FAQSectionProps, FAQItem } from './components/FAQSection';
