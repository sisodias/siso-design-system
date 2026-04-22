import type { MenuCategorySelectorVariant } from './types';
import type { MenuCategorySelectorContent } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as MenuCategorySelectorPrimaryMetadata, MenuCategorySelectorPrimary } from './templates/primary';

export const menuCategorySelectorRegistry = createSectionRegistry<MenuCategorySelectorVariant, MenuCategorySelectorContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: MenuCategorySelectorPrimaryMetadata.name,
      description: MenuCategorySelectorPrimaryMetadata.description,
      screenshot: MenuCategorySelectorPrimaryMetadata.screenshot,
      tags: MenuCategorySelectorPrimaryMetadata.tags,
      load: async () => ({ default: MenuCategorySelectorPrimary }),
    },
  },
});

const components: Record<MenuCategorySelectorVariant, (props: MenuCategorySelectorContent & {
  onSelectCategory?: (categoryId: string) => void;
}) => JSX.Element> = {
  'primary': MenuCategorySelectorPrimary,
};

export function getMenuCategorySelectorVariant(variant: string | undefined): MenuCategorySelectorVariant {
  return resolveVariant(variant, menuCategorySelectorRegistry);
}

export function getMenuCategorySelectorComponent(variant: MenuCategorySelectorVariant) {
  return components[variant];
}

export function listMenuCategorySelectorVariants() {
  return listVariants(menuCategorySelectorRegistry);
}
