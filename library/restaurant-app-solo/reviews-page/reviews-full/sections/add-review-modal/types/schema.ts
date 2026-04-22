import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const addReviewModalContentZodSchema = z.object({
  userName: z.string().nullable().optional(),
  isAuthenticated: z.boolean().optional(),
});

export const addReviewModalContentSchema = createSectionSchema(addReviewModalContentZodSchema);

export type AddReviewModalContentInput = z.input<typeof addReviewModalContentZodSchema>;
export type AddReviewModalContent = z.output<typeof addReviewModalContentZodSchema>;
