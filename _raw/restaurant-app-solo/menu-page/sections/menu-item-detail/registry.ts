import type { MenuItemDetailVariant } from './types';
import type { MenuItemDetailContent } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as MenuItemDetailPrimaryMetadata, MenuItemDetailPrimary } from './templates/primary';

export const menuItemDetailRegistry = createSectionRegistry<MenuItemDetailVariant, MenuItemDetailContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: MenuItemDetailPrimaryMetadata.name,
      description: MenuItemDetailPrimaryMetadata.description,
      screenshot: MenuItemDetailPrimaryMetadata.screenshot,
      tags: MenuItemDetailPrimaryMetadata.tags,
      load: async () => ({ default: MenuItemDetailPrimary }),
    },
  },
});

const components: Record<MenuItemDetailVariant, (props: MenuItemDetailContent & {
  isOpen?: boolean;
  onClose?: () => void;
}) => JSX.Element> = {
  'primary': MenuItemDetailPrimary,
};

export function getMenuItemDetailVariant(variant: string | undefined): MenuItemDetailVariant {
  return resolveVariant(variant, menuItemDetailRegistry);
}

export function getMenuItemDetailComponent(variant: MenuItemDetailVariant) {
  return components[variant];
}

export function listMenuItemDetailVariants() {
  return listVariants(menuItemDetailRegistry);
}
