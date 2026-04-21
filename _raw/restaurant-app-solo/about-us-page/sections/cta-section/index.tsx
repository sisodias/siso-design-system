import type { CtaRendererProps } from './types';
import type { CtaVariant } from './types';
import type { CtaContent } from './types/schema';
import { ctaRegistry, getCtaVariant, getCtaComponent, listCtaVariants } from './registry';

export * from './types';
export { ctaRegistry, listCtaVariants };

export function CtaRenderer({ variant, fallbackVariant, content }: CtaRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getCtaVariant(requested);
  const Component = getCtaComponent(resolved);
  return <Component {...content} />;
}

export function renderCta({ variant, fallbackVariant, content }: CtaRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getCtaVariant(requested);
  const Component = getCtaComponent(resolved);
  return <Component {...content} />;
}

export function getCtaVariants(): Array<{ key: CtaVariant; label: string; description: string }> {
  return listCtaVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { CtaContent };
