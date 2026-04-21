import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { CuisinePhilosophyContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Icon Grid Narrative',
  description: 'Two-column grid that pairs iconography with philosophy copy.',
  recommendedUse: ['About pages', 'Menu philosophy sections'],
  tags: ['icon-grid', 'narrative'],
});

export const load: SectionVariantLoader<CuisinePhilosophyContent> = async () => ({
  default: (await import('./CuisinePhilosophyPrimary')).default,
});

export { default as CuisinePhilosophyPrimary } from './CuisinePhilosophyPrimary';
