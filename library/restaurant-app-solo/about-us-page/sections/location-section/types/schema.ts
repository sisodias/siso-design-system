import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const locationContactMethodSchema = z.object({
  id: z.string().min(1, 'Contact methods require an id.'),
  label: z.string().min(1, 'Contact methods require a label.'),
  value: z.string().min(1, 'Contact methods require a value.'),
  href: z.string().url().optional(),
  type: z.enum(['phone', 'whatsapp', 'email', 'reservation', 'custom']).optional(),
  icon: z.string().optional(),
});

export const locationOperatingHourSchema = z.object({
  day: z.string().min(1, 'Provide the day or range.'),
  open: z.string().min(1, 'Provide an opening time.'),
  close: z.string().min(1, 'Provide a closing time.'),
  note: z.string().optional(),
});

export const locationMapSchema = z
  .object({
    embedUrl: z.string().url().optional(),
    link: z.string().url().optional(),
  })
  .optional();

export const locationContentZodSchema = z.object({
  pillText: z.string().optional(),
  title: z.string().min(1, 'Location sections should be titled.'),
  subtitle: z.string().optional(),
  address: z.string().min(1, 'Provide at least one address line.'),
  map: locationMapSchema,
  hoursSummary: z.string().optional(),
  operatingHours: z.array(locationOperatingHourSchema).optional(),
  contacts: z.array(locationContactMethodSchema).optional(),
  directions: z.string().optional(),
  parkingInfo: z.string().optional(),
  notes: z.array(z.string()).optional(),
});

export const locationContentSchema = createSectionSchema(locationContentZodSchema);

export type LocationContactMethod = z.infer<typeof locationContactMethodSchema>;
export type LocationOperatingHour = z.infer<typeof locationOperatingHourSchema>;
export type LocationContentInput = z.input<typeof locationContentZodSchema>;
export type LocationContent = z.output<typeof locationContentZodSchema>;
