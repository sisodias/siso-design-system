import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const reviewSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  rating: z.number(),
  comment: z.string().nullable().optional(),
  publishedAt: z.union([z.string(), z.date()]).optional(),
});

export const reviewContentZodSchema = z.object({
  title: z.string().optional(),
  viewAllHref: z.string().optional(),
  reviews: z.array(reviewSchema),
  avgRating: z.number().optional(),
  totalCount: z.number().int().optional(),
});

export const reviewContentSchema = createSectionSchema(reviewContentZodSchema);

export type ReviewContentInput = z.input<typeof reviewContentZodSchema>;
export type ReviewContent = z.output<typeof reviewContentZodSchema>;
