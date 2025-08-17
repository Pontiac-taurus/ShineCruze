import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/session';
import { updateServiceSchema } from '@/lib/validations/service';
import { z } from 'zod';

export async function GET(_req: Request, context: { params: { id: string } }) {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: context.params.id },
    });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const json = await req.json();
        const body = updateServiceSchema.parse(json);

        const updatedService = await prisma.service.update({
            where: { id: context.params.id },
            data: {
                title: body.title,
                category: body.category,
                basePrice: body.basePrice,
                duration: body.duration,
                items: body.items,
                vehiclePricing: body.vehiclePricing,
            },
        });

        return NextResponse.json(updatedService);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('Failed to update service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await prisma.service.delete({
            where: { id: context.params.id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        // Handle potential foreign key constraints, e.g., if a service is part of a booking
        if (error.code === 'P2003') {
            return NextResponse.json({ error: 'Cannot delete service because it is associated with existing bookings.' }, { status: 409 });
        }
        console.error('Failed to delete service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
