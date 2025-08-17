import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  quote: z.string().min(10, 'Quote must be at least 10 characters.'),
  rating: z.number().int().min(1).max(5).default(5),
  isVisible: z.boolean().default(false),
});

export const updateTestimonialSchema = testimonialSchema.partial();
