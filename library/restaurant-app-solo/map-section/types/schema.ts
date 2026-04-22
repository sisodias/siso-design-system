import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const hoursSlotSchema = z.object({
  day: z.string(),
  open: z.string(),
  close: z.string(),
  note: z.string().optional(),
});

const contactSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const mapContentZodSchema = z.object({
  address: z.string(),
  label: z.string().optional(),
  embedUrl: z.string().url().optional(),
  iframeTitle: z.string().optional(),
  mapLink: z.string().url().optional(),
  hoursSummary: z.string().optional(),
  operatingHours: z.array(hoursSlotSchema).optional(),
  directions: z.string().optional(),
  parkingInfo: z.string().optional(),
  arrivalNotes: z.array(z.string()).optional(),
  contacts: z.array(contactSchema).optional(),
});

export const mapContentSchema = createSectionSchema(mapContentZodSchema);

export type MapContentInput = z.input<typeof mapContentZodSchema>;
export type MapContent = z.output<typeof mapContentZodSchema>;
