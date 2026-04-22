import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { HeroContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Minimal Spotlight',
  description: 'Centered copy block with restrained typography for text-led storytelling.',
  recommendedUse: ['Minimalist brands', 'Copy-first campaigns'],
  tags: ['minimal', 'text-forward'],
});

export const load: SectionVariantLoader<HeroContent> = async () => ({
  default: (await import('./HeroTemplateTwo')).default,
});

export { default as HeroTemplateTwo } from './HeroTemplateTwo';
