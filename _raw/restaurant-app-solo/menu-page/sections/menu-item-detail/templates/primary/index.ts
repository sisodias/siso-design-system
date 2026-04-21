import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { MenuItemDetailContent } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Menu Item Detail · Primary',
  description: 'Full-screen dialog showcasing imagery, nutrition, and storytelling for a single dish.',
  recommendedUse: ['Modal detail views', 'Product spotlight overlays'],
  tags: ['detail', 'dialog'],
});

export const load: SectionVariantLoader<MenuItemDetailContent> = async () => ({
  default: (await import('./MenuItemDetailPrimary')).default,
});

export { default as MenuItemDetailPrimary } from './MenuItemDetailPrimary';
