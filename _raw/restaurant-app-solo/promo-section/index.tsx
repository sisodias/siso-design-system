import type { PromoRendererProps } from './types';
import type { PromoVariant } from './types';
import type { PromoContent } from './types/schema';
import { promoRegistry, getPromoVariant, getPromoComponent, listPromoVariants } from './registry';

export * from './types';
export { promoRegistry, listPromoVariants };

export function PromoRenderer({ variant, fallbackVariant, content }: PromoRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getPromoVariant(requested);
  const Component = getPromoComponent(resolved);
  return <Component {...content} />;
}

export function renderPromo({ variant, fallbackVariant, content }: PromoRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getPromoVariant(requested);
  const Component = getPromoComponent(resolved);
  return <Component {...content} />;
}

export function getPromoVariants(): Array<{ key: PromoVariant; label: string; description: string }> {
  return listPromoVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { PromoContent };
