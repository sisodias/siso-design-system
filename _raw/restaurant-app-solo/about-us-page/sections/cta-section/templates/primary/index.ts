import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { CtaContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Full-Bleed Hero',
  description: 'Background image hero with dual CTAs and optional delivery partner bar.',
  recommendedUse: ['High-impact About CTA', 'Landing page hero'],
  tags: ['full-bleed', 'dual-cta'],
});

export const load: SectionVariantLoader<CtaContent> = async () => ({
  default: (await import('./CtaPrimary')).default,
});

export { default as CtaPrimary } from './CtaPrimary';
