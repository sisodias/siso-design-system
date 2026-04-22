import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { CtaContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Split Panel',
  description: 'Two-card CTA layout for menu browsing and WhatsApp enquiries.',
  recommendedUse: ['Mid-page CTA', 'Mobile-friendly dual actions'],
  tags: ['dual-cta', 'card'],
});

export const load: SectionVariantLoader<CtaContent> = async () => ({
  default: (await import('./CtaTemplate2')).default,
});

export { default as CtaTemplate2 } from './CtaTemplate2';
