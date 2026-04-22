import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { TeamContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Team Primary',
  description: 'TODO: describe when to use the primary variant.',
  recommendedUse: ['Draft description pending'],
  tags: ['placeholder'],
});

export const load: SectionVariantLoader<TeamContent> = async () => ({
  default: (await import('./TeamPrimary')).default,
});

export { default as TeamPrimary } from './TeamPrimary';
