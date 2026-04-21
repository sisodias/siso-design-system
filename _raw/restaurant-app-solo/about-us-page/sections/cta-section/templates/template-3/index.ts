import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { CtaContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Cta Template3',
  description: 'TODO: describe when to use the template-3 variant.',
  recommendedUse: ['Draft description pending'],
  tags: ['placeholder'],
});

export const load: SectionVariantLoader<CtaContent> = async () => ({
  default: (await import('./CtaTemplate3')).default,
});

export { default as CtaTemplate3 } from './CtaTemplate3';
