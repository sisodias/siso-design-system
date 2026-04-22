import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const reviewCardContentZodSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  publishedAt: z.string(),
  source: z.string(),
  verified: z.boolean(),
  featured: z.boolean(),
  images: z.array(z.string()),
  ownerResponse: z.string().nullable().optional(),
  ownerRespondedAt: z.string().nullable().optional(),
  helpfulCount: z.number().min(0),
  metadata: z
    .object({
      highlights: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

export const reviewCardContentSchema = createSectionSchema(reviewCardContentZodSchema);

export type ReviewCardContentInput = z.input<typeof reviewCardContentZodSchema>;
export type ReviewCardContent = z.output<typeof reviewCardContentZodSchema>;
