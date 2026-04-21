import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { PromoContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Promo · Spotlight Banner',
  description: 'Hero-adjacent banner for live events or limited-time offers with CTA.',
  recommendedUse: ['Seasonal promotions', 'Limited-time events', 'Homepage spotlight'],
  tags: ['promo', 'spotlight', 'events'],
});

export const load: SectionVariantLoader<PromoContent> = async () => ({
  default: (await import('./PromoPrimary')).default,
});

export { default as PromoPrimary } from './PromoPrimary';
