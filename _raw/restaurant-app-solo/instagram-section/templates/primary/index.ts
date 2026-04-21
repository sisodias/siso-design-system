import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { InstagramContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Instagram · Grid Teaser',
  description: 'Six-tile Instagram grid with incentive CTA and follower badge.',
  recommendedUse: ['Social proof blocks', 'Footer community sections'],
  tags: ['social', 'instagram', 'grid'],
});

export const load: SectionVariantLoader<InstagramContent> = async () => ({
  default: (await import('./InstagramPrimary')).default,
});

export { default as InstagramPrimary } from './InstagramPrimary';
