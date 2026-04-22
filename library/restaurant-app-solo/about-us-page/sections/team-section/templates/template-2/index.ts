import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { TeamContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Team Card Grid',
  description: 'Responsive grid of team member cards for compact layouts.',
  recommendedUse: ['Secondary sections', 'Mobile-first pages'],
  tags: ['card-grid', 'team'],
});

export const load: SectionVariantLoader<TeamContent> = async () => ({
  default: (await import('./TeamTemplate2')).default,
});

export { default as TeamTemplate2 } from './TeamTemplate2';
