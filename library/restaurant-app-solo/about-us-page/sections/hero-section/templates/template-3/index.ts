import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { HeroContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Split Feature',
  description: 'Two-column layout pairing photography with storytelling copy.',
  recommendedUse: ['Chef spotlights', 'Signature dishes'],
  tags: ['two-column', 'feature'],
});

export const load: SectionVariantLoader<HeroContent> = async () => ({
  default: (await import('./HeroTemplateThree')).default,
});

export { default as HeroTemplateThree } from './HeroTemplateThree';
