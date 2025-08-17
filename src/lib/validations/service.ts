import { z } from 'zod';
import { ServiceCategory } from '@prisma/client';

export const createServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  category: z.nativeEnum(ServiceCategory),
  basePrice: z.number().positive('Price must be a positive number'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  items: z.array(z.string()).min(1, 'At least one item must be included'),
  vehiclePricing: z.record(z.number().positive()).optional().nullable(),
});

export const updateServiceSchema = createServiceSchema.partial();
