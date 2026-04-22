import type { AwardsRendererProps } from './types';
import type { AwardsVariant } from './types';
import type { AwardsContent } from './types/schema';
import { awardsRegistry, getAwardsVariant, getAwardsComponent, listAwardsVariants } from './registry';

export * from './types';
export { awardsRegistry, listAwardsVariants };

export function AwardsRenderer({ variant, fallbackVariant, content }: AwardsRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getAwardsVariant(requested);
  const Component = getAwardsComponent(resolved);
  return <Component {...content} />;
}

export function renderAwards({ variant, fallbackVariant, content }: AwardsRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getAwardsVariant(requested);
  const Component = getAwardsComponent(resolved);
  return <Component {...content} />;
}

export function getAwardsVariants(): Array<{ key: AwardsVariant; label: string; description: string }> {
  return listAwardsVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { AwardsContent };
