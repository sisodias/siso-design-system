import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { MenuCategoriesContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Menu Categories · Primary',
  description: 'Vertical browser for menu categories with horizontal item carousels, loading/error states, and callouts.',
  recommendedUse: ['Main menu listing', 'Category-first mobile layouts'],
  tags: ['menu', 'categories', 'grid'],
});

export const load: SectionVariantLoader<MenuCategoriesContent> = async () => ({
  default: (await import('./MenuCategoriesPrimary')).default,
});

export { default as MenuCategoriesPrimary } from './MenuCategoriesPrimary';
