import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/session';
import { testimonialSchema } from '@/lib/validations/testimonial';
import { z } from 'zod';

export async function GET() {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials for admin:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const json = await req.json();
        const body = testimonialSchema.parse(json);

        const testimonial = await prisma.testimonial.create({
            data: body,
        });

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('Failed to create testimonial:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}
