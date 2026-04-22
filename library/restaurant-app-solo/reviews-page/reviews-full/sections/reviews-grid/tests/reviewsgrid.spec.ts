import { describe, expect, it } from 'vitest';
import { reviewsGridRegistry, listReviewsGridVariants, getReviewsGridVariant } from '../registry';

describe('ReviewsGrid Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(reviewsGridRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listReviewsGridVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getReviewsGridVariant('unknown')).toBe('primary');
  });
});
