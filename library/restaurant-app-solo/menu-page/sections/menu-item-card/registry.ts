import type { MenuItemCardVariant } from './types';
import type { MenuItemCardContent } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as MenuItemCardPrimaryMetadata, MenuItemCardPrimary } from './templates/primary';

export const menuItemCardRegistry = createSectionRegistry<MenuItemCardVariant, MenuItemCardContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: MenuItemCardPrimaryMetadata.name,
      description: MenuItemCardPrimaryMetadata.description,
      screenshot: MenuItemCardPrimaryMetadata.screenshot,
      tags: MenuItemCardPrimaryMetadata.tags,
      load: async () => ({ default: MenuItemCardPrimary }),
    },
  },
});

const components: Record<MenuItemCardVariant, (props: MenuItemCardContent & {
  onSelectItem?: (itemId: string) => void;
}) => JSX.Element> = {
  'primary': MenuItemCardPrimary,
};

export function getMenuItemCardVariant(variant: string | undefined): MenuItemCardVariant {
  return resolveVariant(variant, menuItemCardRegistry);
}

export function getMenuItemCardComponent(variant: MenuItemCardVariant) {
  return components[variant];
}

export function listMenuItemCardVariants() {
  return listVariants(menuItemCardRegistry);
}
