import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const promotionItemSchema = z.object({
  day: z.string(),
  title: z.string(),
  description: z.string().optional(),
  timeRange: z.string().optional(),
  highlight: z.string().optional(),
  tag: z.string().optional(),
  perks: z.array(z.string()).optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
});

export const promoContentZodSchema = z.object({
  pillText: z.string().optional(),
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  badge: z.string().optional(),
  schedule: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  promotions: z.array(promotionItemSchema).optional(),
});

export const promoContentSchema = createSectionSchema(promoContentZodSchema);

export type PromoContentInput = z.input<typeof promoContentZodSchema>;
export type PromoContent = z.output<typeof promoContentZodSchema>;

export type PromotionItem = z.output<typeof promotionItemSchema>;
