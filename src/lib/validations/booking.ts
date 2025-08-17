import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const createBookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters long'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  customerAddress: z.string().min(5, 'Address must be at least 5 characters long'),
  startAt: z.string().datetime(), // ISO 8601 date string
  endAt: z.string().datetime(),
  totalPrice: z.number().positive(),
  services: z.array(z.object({
    serviceId: z.string(),
    price: z.number().positive(),
  })).min(1, 'At least one service must be selected'),
});

export const updateBookingSchema = createBookingSchema.pick({
    customerName: true,
    customerEmail: true,
    customerPhone: true,
    customerAddress: true,
    startAt: true,
    endAt: true,
    totalPrice: true,
}).extend({
    status: z.nativeEnum(BookingStatus),
}).partial();
