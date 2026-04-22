import type { GuestFeedbackRendererProps } from './types';
import type { GuestFeedbackVariant } from './types';
import type { GuestFeedbackContent } from './types/schema';
import { guestFeedbackRegistry, getGuestFeedbackVariant, getGuestFeedbackComponent, listGuestFeedbackVariants } from './registry';

export * from './types';
export { guestFeedbackRegistry, listGuestFeedbackVariants };

export function GuestFeedbackRenderer({ variant, fallbackVariant, content }: GuestFeedbackRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getGuestFeedbackVariant(requested);
  const Component = getGuestFeedbackComponent(resolved);
  return <Component {...content} />;
}

export function renderGuestFeedback({ variant, fallbackVariant, content }: GuestFeedbackRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getGuestFeedbackVariant(requested);
  const Component = getGuestFeedbackComponent(resolved);
  return <Component {...content} />;
}

export function getGuestFeedbackVariants(): Array<{ key: GuestFeedbackVariant; label: string; description: string }> {
  return listGuestFeedbackVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { GuestFeedbackContent };
