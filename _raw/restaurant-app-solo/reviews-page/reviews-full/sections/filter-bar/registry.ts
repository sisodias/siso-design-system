import type { FilterBarVariant } from './types';
import type { FilterBarContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as FilterBarPrimaryMetadata, FilterBarPrimary } from './templates/primary';

export const filterBarRegistry = createSectionRegistry<FilterBarVariant, FilterBarContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: FilterBarPrimaryMetadata.name,
      description: FilterBarPrimaryMetadata.description,
      screenshot: FilterBarPrimaryMetadata.screenshot,
      tags: FilterBarPrimaryMetadata.tags,
      load: async () => ({ default: FilterBarPrimary }),
    },
  },
});

const components: Record<FilterBarVariant, (props: FilterBarContent) => JSX.Element> = {
  'primary': FilterBarPrimary,
};

export function getFilterBarVariant(variant: string | undefined): FilterBarVariant {
  return resolveVariant(variant, filterBarRegistry);
}

export function getFilterBarComponent(variant: FilterBarVariant) {
  return components[variant];
}

export function listFilterBarVariants() {
  return listVariants(filterBarRegistry);
}
