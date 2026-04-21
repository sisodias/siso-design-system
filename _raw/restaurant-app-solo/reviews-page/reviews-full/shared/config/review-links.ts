import { clientInfo } from '@/config/client';

type SocialConfig = {
  googleMaps?: string;
  googleWriteReview?: string;
};

const SOCIAL_CONFIG = (clientInfo.social ?? {}) as SocialConfig;

const normalize = (value?: string | null) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const envWriteUrl = normalize(process.env.NEXT_PUBLIC_GOOGLE_WRITE_REVIEW_URL);
const configWriteUrl = normalize(SOCIAL_CONFIG.googleWriteReview);
const configMapsUrl = normalize(SOCIAL_CONFIG.googleMaps);

export const reviewLinks = {
  /**
   * Primary destination for viewing the business on Google Maps.
   * Falls back to undefined if not configured.
   */
  googleReviewsUrl: configMapsUrl,
  /**
   * Preferred "Write a review" flow. Falls back to the Maps listing if a dedicated
   * write-review URL is not available yet.
   */
  googleWriteReviewUrl: envWriteUrl ?? configWriteUrl ?? configMapsUrl,
};

export const REVIEW_REWARD_COPY = 'Guests are rewarded for posting.';
