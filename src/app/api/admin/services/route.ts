import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/session';
import { createServiceSchema } from '@/lib/validations/service';
import { z } from 'zod';

export async function GET() {
  const userIsAdmin = await isAdmin();

  if (!userIsAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const userIsAdmin = await isAdmin();

    if (!userIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const json = await req.json();
        const body = createServiceSchema.parse(json);

        const service = await prisma.service.create({
            data: {
                title: body.title,
                category: body.category,
                basePrice: body.basePrice,
                duration: body.duration,
                items: body.items,
                vehiclePricing: body.vehiclePricing || undefined,
            },
        });

        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('Failed to create service:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
