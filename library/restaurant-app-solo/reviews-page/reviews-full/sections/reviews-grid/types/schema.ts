import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const reviewMetadataSchema = z
  .object({
    highlights: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })
  .optional();

export const reviewsGridReviewZodSchema = z.object({
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
  metadata: reviewMetadataSchema,
});

export const reviewsGridContentZodSchema = z.object({
  reviews: z.array(reviewsGridReviewZodSchema),
});

export const reviewsGridContentSchema = createSectionSchema(reviewsGridContentZodSchema);

export type ReviewsGridContentInput = z.input<typeof reviewsGridContentZodSchema>;
export type ReviewsGridContent = z.output<typeof reviewsGridContentZodSchema>;
export type ReviewsGridReview = z.output<typeof reviewsGridReviewZodSchema>;
