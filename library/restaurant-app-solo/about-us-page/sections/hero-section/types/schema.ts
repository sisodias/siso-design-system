import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const heroCtaSchema = z.object({
  label: z.string().min(1, 'CTA buttons need a label.'),
  href: z.string().min(1, 'CTA buttons need a destination.'),
  ariaLabel: z.string().optional(),
  style: z.enum(['primary', 'secondary', 'ghost']).default('primary'),
});

const heroMetaBadgeSchema = z.object({
  id: z.string().min(1, 'Meta badges require a stable id.'),
  label: z.string().min(1, 'Meta badges need a label.'),
  value: z.string().min(1, 'Meta badges need a value.'),
});

export const heroContentZodSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  pillText: z.string().optional(),
  primaryCta: heroCtaSchema.optional(),
  secondaryCta: heroCtaSchema.optional(),
  metaBadges: z.array(heroMetaBadgeSchema).optional(),
});

export const heroContentSchema = createSectionSchema(heroContentZodSchema);

export type HeroContentInput = z.input<typeof heroContentZodSchema>;
export type HeroContent = z.output<typeof heroContentZodSchema>;
export type HeroCta = z.infer<typeof heroCtaSchema>;
export type HeroMetaBadge = z.infer<typeof heroMetaBadgeSchema>;
