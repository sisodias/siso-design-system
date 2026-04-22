import type { PromoContent } from './schema';

export type PromoVariant = 'primary';

export type PromoRendererProps = {
  variant?: PromoVariant | null;
  fallbackVariant?: PromoVariant | null;
  content: PromoContent;
};
