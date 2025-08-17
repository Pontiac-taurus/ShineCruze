import { Booking, BookingService, Service } from '@prisma/client';

export type PopulatedBooking = Booking & {
    services: (BookingService & { service: Service })[];
};
