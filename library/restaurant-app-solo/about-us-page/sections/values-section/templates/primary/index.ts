import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ValuesContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Radiant Values Grid',
  description: 'Glassmorphism card grid that celebrates brand principles with luminous accents.',
  recommendedUse: [
    'Highlighting 4–8 cultural pillars',
    'Pairs with photography-led hero sections',
    'Best when icons reinforce the narrative',
  ],
  tags: ['glassmorphism', 'grid', 'icons'],
});

export const load: SectionVariantLoader<ValuesContent> = async () => ({
  default: (await import('./ValuesPrimary')).default,
});

export { default as ValuesPrimary } from './ValuesPrimary';
export { ValuesGrid } from './components/ValuesGrid';
export type { ValuesGridProps, Value } from './components/ValuesGrid';
