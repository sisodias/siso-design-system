import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const venueGalleryImageSchema = z.object({
  id: z.string().min(1, 'Every gallery image needs an id.'),
  url: z.string().url('Gallery images require a valid URL.'),
  alt: z.string().min(1, 'Describe the image for accessibility.'),
  category: z.string().optional(),
  caption: z.string().optional(),
});

export const venueGalleryCtaSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
  })
  .optional();

export const venueGalleryContentZodSchema = z.object({
  pillText: z.string().optional(),
  title: z.string().min(1, 'Gallery sections need a title.'),
  subtitle: z.string().optional(),
  intro: z.string().optional(),
  showCategories: z.boolean().default(true),
  layout: z.enum(['masonry', 'slider']).default('masonry'),
  images: z.array(venueGalleryImageSchema).min(1, 'Provide at least one gallery image.'),
  cta: venueGalleryCtaSchema,
});

export const venueGalleryContentSchema = createSectionSchema(venueGalleryContentZodSchema);

export type VenueGalleryImage = z.infer<typeof venueGalleryImageSchema>;
export type VenueGalleryContentInput = z.input<typeof venueGalleryContentZodSchema>;
export type VenueGalleryContent = z.output<typeof venueGalleryContentZodSchema>;
