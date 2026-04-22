import type { ImageLightboxRendererProps } from './types';
import type { ImageLightboxVariant } from './types';
import type { ImageLightboxContent } from './types/schema';
import { imageLightboxRegistry, getImageLightboxVariant, getImageLightboxComponent, listImageLightboxVariants } from './registry';

export * from './types';
export { imageLightboxRegistry, listImageLightboxVariants };

export function ImageLightboxRenderer({
  variant,
  fallbackVariant,
  content,
  onClose,
  onNext,
  onPrev,
}: ImageLightboxRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getImageLightboxVariant(requested);
  const Component = getImageLightboxComponent(resolved);
  return <Component {...content} onClose={onClose} onNext={onNext} onPrev={onPrev} />;
}

export function renderImageLightbox({
  variant,
  fallbackVariant,
  content,
  onClose,
  onNext,
  onPrev,
}: ImageLightboxRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getImageLightboxVariant(requested);
  const Component = getImageLightboxComponent(resolved);
  return <Component {...content} onClose={onClose} onNext={onNext} onPrev={onPrev} />;
}

export function getImageLightboxVariants(): Array<{ key: ImageLightboxVariant; label: string; description: string }> {
  return listImageLightboxVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { ImageLightboxContent };
