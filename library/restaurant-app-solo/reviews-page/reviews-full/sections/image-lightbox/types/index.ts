import type { ComponentType } from 'react';
import type { ImageLightboxContent } from './schema';

export type ImageLightboxVariant = 'primary';

export interface ImageLightboxRendererProps {
  variant?: ImageLightboxVariant;
  content: ImageLightboxContent;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  fallbackVariant?: ImageLightboxVariant;
}

export type ImageLightboxComponentProps = ImageLightboxContent & {
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export type ImageLightboxComponent = ComponentType<ImageLightboxComponentProps>;

export type { ImageLightboxContent } from './schema';
