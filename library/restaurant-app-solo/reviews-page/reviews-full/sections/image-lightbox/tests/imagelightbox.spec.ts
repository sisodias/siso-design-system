import { describe, expect, it } from 'vitest';
import { imageLightboxRegistry, listImageLightboxVariants, getImageLightboxVariant } from '../registry';

describe('ImageLightbox Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(imageLightboxRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listImageLightboxVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getImageLightboxVariant('unknown')).toBe('primary');
  });
});
