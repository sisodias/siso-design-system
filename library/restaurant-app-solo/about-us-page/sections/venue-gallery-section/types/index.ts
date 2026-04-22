import type { ComponentType } from 'react';
import type { VenueGalleryContent } from './schema';

export type VenueGalleryVariant = 'primary' | 'template-2' | 'template-3';

export interface VenueGalleryRendererProps {
  variant?: VenueGalleryVariant;
  content: VenueGalleryContent;
  fallbackVariant?: VenueGalleryVariant;
}

export type VenueGalleryComponent = ComponentType<VenueGalleryContent>;
export type { VenueGalleryContent, VenueGalleryImage } from './schema';
