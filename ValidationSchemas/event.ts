// ValidationSchemas/event.ts
import { z } from 'zod'

// Define the event schema
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(5000),

  // Date handling - required in Prisma schema
  date: z.union([
    z.date(),
    z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
      })
      .transform((val) => new Date(val)),
  ]),

  // Required in Prisma schema
  location: z.string().min(1, 'Location is required'),

  // Optional fields with defaults matching Prisma schema
  imageUrl: z.string().url('Must be a valid URL').optional().nullable(),
  startTime: z.string().default('18:00'),
  endTime: z.string().default('21:00'),
  category: z.string().default('other'),
  capacity: z.number().int().positive().default(100),

  // Status field
  status: z
    .enum(['UPCOMING', 'INPROGRESS', 'COMPLETED', 'CANCELLED'])
    .optional()
    .nullable(),

  // This field is needed for editing events
  organizerId: z.string().optional(),
})

// For TypeScript type inference
export type EventFormData = z.infer<typeof eventSchema>
