import type { ReviewCardVariant } from '@/domains/customer-facing/reviews/sections/review-card';

const ALLOWED_CARD_VARIANTS: ReviewCardVariant[] = ['primary', 'noir'];

const normalizeVariant = (value?: string | null): ReviewCardVariant => {
  if (!value) return 'primary';
  const normalized = value.trim().toLowerCase();
  return (ALLOWED_CARD_VARIANTS as readonly string[]).includes(normalized)
    ? (normalized as ReviewCardVariant)
    : 'primary';
};

const envVariant = normalizeVariant(process.env.NEXT_PUBLIC_REVIEWS_CARD_VARIANT);

export const reviewTheme: {
  cardVariant: ReviewCardVariant;
} = {
  cardVariant: envVariant,
};
