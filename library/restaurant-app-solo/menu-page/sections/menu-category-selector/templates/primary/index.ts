import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { MenuCategorySelectorContent } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Menu Category Selector · Primary',
  description: 'Sticky tabbed selector with optional dropdown for narrow viewports.',
  recommendedUse: ['Menu landing pages', 'Category-heavy menus'],
  tags: ['navigation', 'filter'],
});

export const load: SectionVariantLoader<MenuCategorySelectorContent> = async () => ({
  default: (await import('./MenuCategorySelectorPrimary')).default,
});

export { default as MenuCategorySelectorPrimary } from './MenuCategorySelectorPrimary';
