import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { CuisinePhilosophyContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Minimal Hero',
  description: 'Centered headline treatment with supporting copy for philosophy statements.',
  recommendedUse: ['Simple storytelling blocks', 'Lightweight landing pages'],
  tags: ['hero', 'centered'],
});

export const load: SectionVariantLoader<CuisinePhilosophyContent> = async () => ({
  default: (await import('./CuisinePhilosophyTemplate3')).default,
});

export { default as CuisinePhilosophyTemplate3 } from './CuisinePhilosophyTemplate3';
