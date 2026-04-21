import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { CuisinePhilosophyContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Card Grid',
  description: 'Three-up card grid for condensed philosophy highlights.',
  recommendedUse: ['Secondary CTA blocks', 'Mobile-friendly snapshots'],
  tags: ['cards', 'grid'],
});

export const load: SectionVariantLoader<CuisinePhilosophyContent> = async () => ({
  default: (await import('./CuisinePhilosophyTemplate2')).default,
});

export { default as CuisinePhilosophyTemplate2 } from './CuisinePhilosophyTemplate2';
