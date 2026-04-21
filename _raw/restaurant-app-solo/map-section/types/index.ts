import type { ComponentType } from 'react';
import type { MapContent } from './schema';

export type MapVariant = 'primary';

export interface MapRendererProps {
  variant?: MapVariant;
  content: MapContent;
  fallbackVariant?: MapVariant;
}

export type MapComponent = ComponentType<MapContent>;
