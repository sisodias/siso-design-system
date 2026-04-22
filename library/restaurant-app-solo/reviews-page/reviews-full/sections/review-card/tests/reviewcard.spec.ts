import { describe, expect, it } from 'vitest';
import { reviewCardRegistry, listReviewCardVariants, getReviewCardVariant } from '../registry';

describe('ReviewCard Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(reviewCardRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listReviewCardVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getReviewCardVariant('unknown')).toBe('primary');
  });
});
