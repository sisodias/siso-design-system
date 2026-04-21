import { describe, expect, it } from 'vitest';
import { ratingsSummaryRegistry, listRatingsSummaryVariants, getRatingsSummaryVariant } from '../registry';

describe('RatingsSummary Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(ratingsSummaryRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listRatingsSummaryVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getRatingsSummaryVariant('unknown')).toBe('primary');
  });
});
