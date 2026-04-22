import type { ComponentType } from 'react';
import type { LocationContent } from './schema';

export type LocationVariant = 'primary' | 'template-2' | 'template-3';

export interface LocationRendererProps {
  variant?: LocationVariant;
  content: LocationContent;
  fallbackVariant?: LocationVariant;
}

export type LocationComponent = ComponentType<LocationContent>;
export type { LocationContent, LocationContactMethod, LocationOperatingHour } from './schema';
