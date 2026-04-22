import type { MapRendererProps } from './types';
import type { MapVariant } from './types';
import type { MapContent } from './types/schema';
import { mapRegistry, getMapVariant, getMapComponent, listMapVariants } from './registry';

export * from './types';
export { mapRegistry, listMapVariants };

export function MapRenderer({ variant, fallbackVariant, content }: MapRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMapVariant(requested);
  const Component = getMapComponent(resolved);
  return <Component {...content} />;
}

export function renderMap({ variant, fallbackVariant, content }: MapRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getMapVariant(requested);
  const Component = getMapComponent(resolved);
  return <Component {...content} />;
}

export function getMapVariants(): Array<{ key: MapVariant; label: string; description: string }> {
  return listMapVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { MapContent };
