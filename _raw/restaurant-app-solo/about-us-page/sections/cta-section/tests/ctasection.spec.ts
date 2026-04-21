import { describe, expect, it } from 'vitest';
import { ctaRegistry, listCtaVariants, getCtaVariant } from '../registry';

describe('Cta Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(ctaRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listCtaVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getCtaVariant('unknown')).toBe('primary');
  });
});
