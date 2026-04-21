import { describe, expect, it } from 'vitest';
import { addReviewModalRegistry, listAddReviewModalVariants, getAddReviewModalVariant } from '../registry';

describe('AddReviewModal Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(addReviewModalRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listAddReviewModalVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getAddReviewModalVariant('unknown')).toBe('primary');
  });
});
