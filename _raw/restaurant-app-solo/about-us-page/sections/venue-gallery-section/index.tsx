import type { VenueGalleryRendererProps } from './types';
import type { VenueGalleryVariant } from './types';
import type { VenueGalleryContent } from './types/schema';
import { venueGalleryRegistry, getVenueGalleryVariant, getVenueGalleryComponent, listVenueGalleryVariants } from './registry';

export * from './types';
export { venueGalleryRegistry, listVenueGalleryVariants };

export function VenueGalleryRenderer({ variant, fallbackVariant, content }: VenueGalleryRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getVenueGalleryVariant(requested);
  const Component = getVenueGalleryComponent(resolved);
  return <Component {...content} />;
}

export function renderVenueGallery({ variant, fallbackVariant, content }: VenueGalleryRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getVenueGalleryVariant(requested);
  const Component = getVenueGalleryComponent(resolved);
  return <Component {...content} />;
}

export function getVenueGalleryVariants(): Array<{ key: VenueGalleryVariant; label: string; description: string }> {
  return listVenueGalleryVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { VenueGalleryContent, VenueGalleryImage };
