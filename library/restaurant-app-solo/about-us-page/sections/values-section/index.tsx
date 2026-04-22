import type { ValuesRendererProps } from './types';
import type { ValuesVariant } from './types';
import type { ValuesContent } from './types/schema';
import { valuesRegistry, getValuesVariant, getValuesComponent, listValuesVariants } from './registry';

export * from './types';
export { valuesRegistry, listValuesVariants };

export function ValuesRenderer({ variant, fallbackVariant, content }: ValuesRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getValuesVariant(requested);
  const Component = getValuesComponent(resolved);
  return <Component {...content} />;
}

export function renderValues({ variant, fallbackVariant, content }: ValuesRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getValuesVariant(requested);
  const Component = getValuesComponent(resolved);
  return <Component {...content} />;
}

export function getValuesVariants(): Array<{ key: ValuesVariant; label: string; description: string }> {
  return listValuesVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { ValuesContent, ValuesItem, ValuesIcon };
