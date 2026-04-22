import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const instagramContentZodSchema = z.object({
  instagramHandle: z.string().optional(),
  instagramUrl: z.string().optional(),
  incentiveText: z.string().optional(),
  images: z.array(z.string()).optional(),
  followerBadge: z.string().optional(),
});

export const instagramContentSchema = createSectionSchema(instagramContentZodSchema);

export type InstagramContentInput = z.input<typeof instagramContentZodSchema>;
export type InstagramContent = z.output<typeof instagramContentZodSchema>;
