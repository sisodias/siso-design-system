import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { MenuItemCardContent } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Menu Item Card · Primary',
  description: 'Image-forward card highlighting price, dietary badges, and nutrition chips.',
  recommendedUse: ['Menu carousels', 'Feature grids'],
  tags: ['card', 'menu'],
});

export const load: SectionVariantLoader<MenuItemCardContent> = async () => ({
  default: (await import('./MenuItemCardPrimary')).default,
});

export { default as MenuItemCardPrimary } from './MenuItemCardPrimary';
