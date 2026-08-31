import { NextResponse } from 'next/server';
import { activeGenerations } from '@/lib/engine/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const generationId = params.id;
  const gen = activeGenerations.get(generationId);

  if (!gen) {
    return NextResponse.json(
      { success: false, error: 'Generation job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: gen
  });
}
