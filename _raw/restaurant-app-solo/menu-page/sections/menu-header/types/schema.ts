import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const ctaSchema = z.object({
  label: z.string().min(1, 'CTA label is required'),
  href: z.string().min(1, 'CTA link is required'),
  icon: z.enum(['shopping-bag']).optional(),
});

export const menuHeaderContentZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  showSeedButton: z.boolean().optional(),
  cta: ctaSchema.optional(),
});

export const menuHeaderContentSchema = createSectionSchema(menuHeaderContentZodSchema);

export type MenuHeaderContentInput = z.input<typeof menuHeaderContentZodSchema>;
export type MenuHeaderContent = z.output<typeof menuHeaderContentZodSchema>;
export type MenuHeaderCTA = z.output<typeof ctaSchema>;
