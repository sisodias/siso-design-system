import type { MenuCategoriesVariant } from './types';
import type { MenuCategoriesContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as MenuCategoriesPrimaryMetadata, MenuCategoriesPrimary } from './templates/primary';

export const menuCategoriesRegistry = createSectionRegistry<MenuCategoriesVariant, MenuCategoriesContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: MenuCategoriesPrimaryMetadata.name,
      description: MenuCategoriesPrimaryMetadata.description,
      screenshot: MenuCategoriesPrimaryMetadata.screenshot,
      tags: MenuCategoriesPrimaryMetadata.tags,
      load: async () => ({ default: MenuCategoriesPrimary }),
    },
  },
});

const components: Record<MenuCategoriesVariant, (props: MenuCategoriesContent) => JSX.Element> = {
  'primary': MenuCategoriesPrimary,
};

export function getMenuCategoriesVariant(variant: string | undefined): MenuCategoriesVariant {
  return resolveVariant(variant, menuCategoriesRegistry);
}

export function getMenuCategoriesComponent(variant: MenuCategoriesVariant) {
  return components[variant];
}

export function listMenuCategoriesVariants() {
  return listVariants(menuCategoriesRegistry);
}
