import type { MenuHeaderRendererProps } from './types';
import type { MenuHeaderVariant } from './types';
import type { MenuHeaderContent } from './types/schema';
import { menuHeaderRegistry, getMenuHeaderVariant, getMenuHeaderComponent, listMenuHeaderVariants } from './registry';

export * from './types';
export { menuHeaderRegistry, listMenuHeaderVariants };

export function MenuHeaderRenderer({ variant, fallbackVariant, content }: MenuHeaderRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuHeaderVariant(requested);
  const Component = getMenuHeaderComponent(resolved);
  return <Component {...content} />;
}

export function renderMenuHeader({ variant, fallbackVariant, content }: MenuHeaderRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMenuHeaderVariant(requested);
  const Component = getMenuHeaderComponent(resolved);
  return <Component {...content} />;
}

export function getMenuHeaderVariants(): Array<{ key: MenuHeaderVariant; label: string; description: string }> {
  return listMenuHeaderVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { MenuHeaderContent };
