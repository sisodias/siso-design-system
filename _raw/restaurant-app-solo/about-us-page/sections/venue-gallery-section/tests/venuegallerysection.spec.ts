import { describe, expect, it } from 'vitest';
import { venueGalleryRegistry, listVenueGalleryVariants, getVenueGalleryVariant } from '../registry';

describe('VenueGallery Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(venueGalleryRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listVenueGalleryVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getVenueGalleryVariant('unknown')).toBe('primary');
  });
});
