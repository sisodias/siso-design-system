import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { HeroContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Full-Bleed Statement',
  description: 'Bold hero with gradient overlay, centered copy, and animated scroll cue.',
  recommendedUse: [
    'Photography-led brands',
    'Single-location restaurants with signature imagery',
  ],
  tags: ['dramatic', 'full-bleed', 'immersive'],
});

export const load: SectionVariantLoader<HeroContent> = async () => ({
  default: (await import('./HeroPrimary')).default,
});

export { default as HeroPrimary } from './HeroPrimary';
