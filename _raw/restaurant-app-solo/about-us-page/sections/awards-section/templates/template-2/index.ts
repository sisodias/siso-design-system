import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { AwardsContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Guest Spotlight',
  description: 'Compact testimonial card ideal for tight layouts or mobile hero replacements.',
  recommendedUse: ['Mobile-first landing blocks', 'Sidebars', 'Email-friendly embeds'],
  tags: ['compact', 'testimonial'],
});

export const load: SectionVariantLoader<AwardsContent> = async () => ({
  default: (await import('./AwardsTemplateTwo')).default,
});

export { default as AwardsTemplateTwo } from './AwardsTemplateTwo';
