import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createBookingSchema } from '@/lib/validations/booking';
import { z } from 'zod';
import { sendBookingConfirmationEmail, sendAdminNewBookingNotification } from '@/lib/email';
import { PopulatedBooking } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = createBookingSchema.parse(json);

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      startAt,
      endAt,
      totalPrice,
      services,
    } = body;

    // TODO: Check for availability before creating the booking.
    // This will be handled by the GET /api/availability endpoint logic,
    // which the frontend should call before enabling the booking button.
    // For now, we assume the slot is available.

    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          customerAddress,
          startAt: new Date(startAt),
          endAt: new Date(endAt),
          totalPrice,
          status: 'PENDING',
        },
      });

      const bookingServices = services.map((service) => ({
        bookingId: newBooking.id,
        serviceId: service.serviceId,
        price: service.price,
      }));

      await tx.bookingService.createMany({
        data: bookingServices,
      });

      // Return the full booking object to use for emails
      return tx.booking.findUnique({
          where: { id: newBooking.id },
          include: {
              services: {
                  include: {
                      service: true
                  }
              }
          }
      });
    });

    if (booking) {
      await sendBookingConfirmationEmail(booking as PopulatedBooking);
      await sendAdminNewBookingNotification(booking as PopulatedBooking);
    }

    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
