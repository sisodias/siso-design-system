import type { LocationRendererProps } from './types';
import type { LocationVariant } from './types';
import type { LocationContent } from './types/schema';
import { locationRegistry, getLocationVariant, getLocationComponent, listLocationVariants } from './registry';

export * from './types';
export { locationRegistry, listLocationVariants };

export function LocationRenderer({ variant, fallbackVariant, content }: LocationRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getLocationVariant(requested);
  const Component = getLocationComponent(resolved);
  return <Component {...content} />;
}

export function renderLocation({ variant, fallbackVariant, content }: LocationRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getLocationVariant(requested);
  const Component = getLocationComponent(resolved);
  return <Component {...content} />;
}

export function getLocationVariants(): Array<{ key: LocationVariant; label: string; description: string }> {
  return listLocationVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { LocationContent, LocationContactMethod, LocationOperatingHour };
