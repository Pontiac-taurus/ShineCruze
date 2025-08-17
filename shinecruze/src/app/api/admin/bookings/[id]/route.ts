import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/session';
import { updateBookingSchema } from '@/lib/validations/booking';
import { z } from 'zod';

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
        const json = await req.json();
        const body = updateBookingSchema.parse(json);

        const updatedBooking = await prisma.booking.update({
            where: { id: params.id },
            data: body,
        });

        return NextResponse.json(updatedBooking);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('Failed to update booking:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: RouteContext) {
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await prisma.booking.delete({
            where: { id: params.id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete booking:', error);
        return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
    }
}
