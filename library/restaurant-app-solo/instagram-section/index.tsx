import type { InstagramRendererProps } from './types';
import type { InstagramVariant } from './types';
import type { InstagramContent } from './types/schema';
import { instagramRegistry, getInstagramVariant, getInstagramComponent, listInstagramVariants } from './registry';

export * from './types';
export { instagramRegistry, listInstagramVariants };

export function InstagramRenderer({ variant, fallbackVariant, content }: InstagramRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getInstagramVariant(requested);
  const Component = getInstagramComponent(resolved);
  return <Component {...content} />;
}

export function renderInstagram({ variant, fallbackVariant, content }: InstagramRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getInstagramVariant(requested);
  const Component = getInstagramComponent(resolved);
  return <Component {...content} />;
}

export function getInstagramVariants(): Array<{ key: InstagramVariant; label: string; description: string }> {
  return listInstagramVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { InstagramContent };
