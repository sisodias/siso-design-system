import { describe, expect, it } from 'vitest';
import { faqRegistry, listFaqVariants, getFaqVariant } from '../registry';

describe('Faq Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(faqRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listFaqVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getFaqVariant('unknown')).toBe('primary');
  });
});
