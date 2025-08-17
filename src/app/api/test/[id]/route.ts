import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: { id: string } }) {
  return NextResponse.json({ id: context.params.id });
}
