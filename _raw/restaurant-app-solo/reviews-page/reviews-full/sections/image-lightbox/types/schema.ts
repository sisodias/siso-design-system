import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const imageLightboxContentZodSchema = z.object({
  images: z.array(z.string()),
  currentIndex: z.number().min(0),
});

export const imageLightboxContentSchema = createSectionSchema(imageLightboxContentZodSchema);

export type ImageLightboxContentInput = z.input<typeof imageLightboxContentZodSchema>;
export type ImageLightboxContent = z.output<typeof imageLightboxContentZodSchema>;
