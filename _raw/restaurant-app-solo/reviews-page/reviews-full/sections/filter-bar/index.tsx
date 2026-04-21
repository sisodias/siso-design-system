import type { FilterBarRendererProps } from './types';
import type { FilterBarVariant } from './types';
import type { FilterBarContent } from './types/schema';
import { filterBarRegistry, getFilterBarVariant, getFilterBarComponent, listFilterBarVariants } from './registry';

export * from './types';
export { filterBarRegistry, listFilterBarVariants };

export function FilterBarRenderer({ variant, fallbackVariant, content }: FilterBarRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getFilterBarVariant(requested);
  const Component = getFilterBarComponent(resolved);
  return <Component {...content} />;
}

export function renderFilterBar({ variant, fallbackVariant, content }: FilterBarRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getFilterBarVariant(requested);
  const Component = getFilterBarComponent(resolved);
  return <Component {...content} />;
}

export function getFilterBarVariants(): Array<{ key: FilterBarVariant; label: string; description: string }> {
  return listFilterBarVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { FilterBarContent };
