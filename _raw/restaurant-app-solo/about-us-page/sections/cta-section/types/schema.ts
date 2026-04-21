import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const deliveryPartnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  href: z.string().url(),
  brandColor: z.string().optional(),
  initials: z.string().optional(),
});

export const ctaContentZodSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  backgroundImage: z.string().url().optional(),
  showDeliveryPartners: z.boolean().optional(),
  menuHref: z.string().optional(),
  whatsappNumber: z.string().optional(),
  deliveryPartners: z.array(deliveryPartnerSchema).optional(),
});

export const ctaContentSchema = createSectionSchema(ctaContentZodSchema);

export type CtaContentInput = z.input<typeof ctaContentZodSchema>;
export type CtaContent = z.output<typeof ctaContentZodSchema>;
export type DeliveryPartner = z.output<typeof deliveryPartnerSchema>;
