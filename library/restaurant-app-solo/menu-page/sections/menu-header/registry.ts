import type { MenuHeaderVariant } from './types';
import type { MenuHeaderContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as MenuHeaderPrimaryMetadata, MenuHeaderPrimary } from './templates/primary';

export const menuHeaderRegistry = createSectionRegistry<MenuHeaderVariant, MenuHeaderContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: MenuHeaderPrimaryMetadata.name,
      description: MenuHeaderPrimaryMetadata.description,
      screenshot: MenuHeaderPrimaryMetadata.screenshot,
      tags: MenuHeaderPrimaryMetadata.tags,
      load: async () => ({ default: MenuHeaderPrimary }),
    },
  },
});

const components: Record<MenuHeaderVariant, (props: MenuHeaderContent) => JSX.Element> = {
  'primary': MenuHeaderPrimary,
};

export function getMenuHeaderVariant(variant: string | undefined): MenuHeaderVariant {
  return resolveVariant(variant, menuHeaderRegistry);
}

export function getMenuHeaderComponent(variant: MenuHeaderVariant) {
  return components[variant];
}

export function listMenuHeaderVariants() {
  return listVariants(menuHeaderRegistry);
}
