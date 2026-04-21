import { describe, expect, it } from 'vitest';
import { guestFeedbackRegistry, listGuestFeedbackVariants, getGuestFeedbackVariant } from '../registry';

describe('GuestFeedback Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(guestFeedbackRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listGuestFeedbackVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getGuestFeedbackVariant('unknown')).toBe('primary');
  });
});
