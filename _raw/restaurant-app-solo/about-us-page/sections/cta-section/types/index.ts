import type { ComponentType } from 'react';
import type { CtaContent, DeliveryPartner } from './schema';

export type CtaVariant = 'primary' | 'template-2' | 'template-3';

export interface CtaRendererProps {
  variant?: CtaVariant;
  content: CtaContent;
  fallbackVariant?: CtaVariant;
}

export type CtaComponent = ComponentType<CtaContent>;
export type { CtaContent, DeliveryPartner };
