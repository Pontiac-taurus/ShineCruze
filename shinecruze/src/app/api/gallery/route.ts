import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const galleryImages = await prisma.media.findMany({
      where: {
        category: 'gallery',
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(galleryImages);
  } catch (error) {
    console.error('Failed to fetch gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}
