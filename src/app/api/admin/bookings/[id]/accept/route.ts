import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/session';
import { sendBookingStatusUpdateEmail } from '@/lib/email';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'ACCEPTED' },
    });

    await sendBookingStatusUpdateEmail(updatedBooking, 'ACCEPTED');

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Failed to accept booking:', error);
    return NextResponse.json({ error: 'Failed to accept booking' }, { status: 500 });
  }
}
