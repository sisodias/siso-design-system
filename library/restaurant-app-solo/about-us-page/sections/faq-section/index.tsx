import type { FaqRendererProps } from './types';
import type { FaqVariant } from './types';
import type { FaqContent } from './types/schema';
import { faqRegistry, getFaqVariant, getFaqComponent, listFaqVariants } from './registry';

export * from './types';
export { faqRegistry, listFaqVariants };

export function FaqRenderer({ variant, fallbackVariant, content }: FaqRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getFaqVariant(requested);
  const Component = getFaqComponent(resolved);
  return <Component {...content} />;
}

export function renderFaq({ variant, fallbackVariant, content }: FaqRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getFaqVariant(requested);
  const Component = getFaqComponent(resolved);
  return <Component {...content} />;
}

export function getFaqVariants(): Array<{ key: FaqVariant; label: string; description: string }> {
  return listFaqVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { FaqContent, FaqItem, FaqCategory, FaqCta };
