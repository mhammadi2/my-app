import { z } from 'zod'

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255),
  description: z.string().min(1, 'Description is required.').max(65535),
  location: z.string().min(1, 'Location').max(10).optional(),
  date: z.Date,
})

export const eventPatchSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(255).optional(),
  description: z
    .string()
    .min(1, 'Description is required.')
    .max(65535)
    .optional(),
  location: z.string().min(1, 'Location').max(10).optional(),
  date: z.Date,
})
