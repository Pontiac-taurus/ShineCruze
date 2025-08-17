import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// --- Configuration ---
// In a real app, this should be stored in the database and be configurable by admins.
const WORKING_HOURS_START = 9; // 9 AM
const WORKING_HOURS_END = 17; // 5 PM
const SLOT_DURATION_MINUTES = 30; // The granularity of available slots

const getAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());

  try {
    const { date } = getAvailabilitySchema.parse(params);
    const selectedDate = new Date(`${date}T00:00:00.000Z`); // Treat date as UTC

    const dayStart = new Date(selectedDate);
    dayStart.setUTCHours(WORKING_HOURS_START, 0, 0, 0);

    const dayEnd = new Date(selectedDate);
    dayEnd.setUTCHours(WORKING_HOURS_END, 0, 0, 0);

    // Fetch bookings that are not denied, canceled, or completed
    const bookings = await prisma.booking.findMany({
      where: {
        startAt: {
          gte: dayStart,
          lt: dayEnd,
        },
        status: {
          in: ['PENDING', 'ACCEPTED'],
        }
      },
      select: {
        startAt: true,
        endAt: true,
      },
    });

    // Generate all possible time slots for the day
    const allSlots = [];
    for (let time = dayStart.getTime(); time < dayEnd.getTime(); time += SLOT_DURATION_MINUTES * 60000) {
        allSlots.push(new Date(time));
    }

    // Filter out slots that overlap with existing bookings
    // Note: This is a simplified approach. A more robust solution would check if a
    // requested service duration fits *before* a booked slot, even if the start time is unavailable.
    const availableSlots = allSlots.filter(slot => {
      // For this simplified check, we just check the start time of the slot.
      // The frontend will need to calculate the end time based on selected services
      // and ensure it doesn't run into the next booked appointment.
      return !bookings.some(booking => {
        const bookingStart = new Date(booking.startAt);
        const bookingEnd = new Date(booking.endAt);
        // A slot is unavailable if it's within the time range of an existing booking.
        return slot >= bookingStart && slot < bookingEnd;
      });
    });

    return NextResponse.json(availableSlots);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Failed to get availability:', error);
    return NextResponse.json({ error: 'Failed to get availability' }, { status: 500 });
  }
}
