import type { AddReviewModalRendererProps } from './types';
import type { AddReviewModalVariant } from './types';
import type { AddReviewModalContent } from './types/schema';
import { addReviewModalRegistry, getAddReviewModalVariant, getAddReviewModalComponent, listAddReviewModalVariants } from './registry';

export * from './types';
export { addReviewModalRegistry, listAddReviewModalVariants };

export function AddReviewModalRenderer({
  variant,
  fallbackVariant,
  content,
  isOpen,
  onClose,
  onSubmit,
}: AddReviewModalRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getAddReviewModalVariant(requested);
  const Component = getAddReviewModalComponent(resolved);
  return <Component content={content} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />;
}

export function renderAddReviewModal({
  variant,
  fallbackVariant,
  content,
  isOpen,
  onClose,
  onSubmit,
}: AddReviewModalRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getAddReviewModalVariant(requested);
  const Component = getAddReviewModalComponent(resolved);
  return <Component content={content} isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} />;
}

export function getAddReviewModalVariants(): Array<{ key: AddReviewModalVariant; label: string; description: string }> {
  return listAddReviewModalVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { AddReviewModalContent };
