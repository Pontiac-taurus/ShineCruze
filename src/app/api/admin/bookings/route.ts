import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/session';
import { BookingStatus } from '@prisma/client';

export async function GET(req: Request) {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const where = status ? { status: status as BookingStatus } : {};

  try {
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        services: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        startAt: 'asc',
      },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
