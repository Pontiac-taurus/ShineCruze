import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/session';
import { updateTestimonialSchema } from '@/lib/validations/testimonial';
import { z } from 'zod';

export async function GET(_req: Request, context: { params: { id: string } }) {
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: context.params.id },
    });
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Failed to fetch testimonial:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const json = await req.json();
        const body = updateTestimonialSchema.parse(json);

        const updatedTestimonial = await prisma.testimonial.update({
            where: { id: context.params.id },
            data: body,
        });

        return NextResponse.json(updatedTestimonial);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        console.error('Failed to update testimonial:', error);
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    const userIsAdmin = await isAdmin();
    if (!userIsAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await prisma.testimonial.delete({
            where: { id: context.params.id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete testimonial:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
