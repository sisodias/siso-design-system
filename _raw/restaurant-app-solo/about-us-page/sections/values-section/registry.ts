import type { ValuesVariant } from './types';
import type { ValuesContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as ValuesPrimaryMetadata, ValuesPrimary } from './templates/primary';
import { metadata as ValuesTemplate2Metadata, ValuesTemplate2 } from './templates/template-2';
import { metadata as ValuesTemplate3Metadata, ValuesTemplate3 } from './templates/template-3';

export const valuesRegistry = createSectionRegistry<ValuesVariant, ValuesContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: ValuesPrimaryMetadata.name,
      description: ValuesPrimaryMetadata.description,
      screenshot: ValuesPrimaryMetadata.screenshot,
      tags: ValuesPrimaryMetadata.tags,
      supports: { icons: true, glassmorphism: true },
      load: async () => ({ default: ValuesPrimary }),
    },
    'template-2': {
      label: ValuesTemplate2Metadata.name,
      description: ValuesTemplate2Metadata.description,
      screenshot: ValuesTemplate2Metadata.screenshot,
      tags: ValuesTemplate2Metadata.tags,
      supports: { spotlight: true, editorial: true },
      load: async () => ({ default: ValuesTemplate2 }),
    },
    'template-3': {
      label: ValuesTemplate3Metadata.name,
      description: ValuesTemplate3Metadata.description,
      screenshot: ValuesTemplate3Metadata.screenshot,
      tags: ValuesTemplate3Metadata.tags,
      supports: { placeholder: true },
      load: async () => ({ default: ValuesTemplate3 }),
    },
  },
});

const components: Record<ValuesVariant, (props: ValuesContent) => JSX.Element> = {
  'primary': ValuesPrimary,
  'template-2': ValuesTemplate2,
  'template-3': ValuesTemplate3,
};

export function getValuesVariant(variant: string | undefined): ValuesVariant {
  return resolveVariant(variant, valuesRegistry);
}

export function getValuesComponent(variant: ValuesVariant) {
  return components[variant];
}

export function listValuesVariants() {
  return listVariants(valuesRegistry);
}
