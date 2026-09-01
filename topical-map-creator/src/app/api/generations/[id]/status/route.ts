import { NextResponse } from 'next/server';
import { activeGenerations } from '@/lib/engine/store';
import { getEngineResultFromDb } from '@/lib/services/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const generationId = params.id;
  const gen = activeGenerations.get(generationId);

  if (gen) {
    return NextResponse.json({
      success: true,
      data: gen
    });
  }

  // Check Supabase PostgreSQL database if available
  const dbResult = await getEngineResultFromDb(generationId);
  if (dbResult) {
    return NextResponse.json({
      success: true,
      data: {
        id: generationId,
        projectId: dbResult.projectId,
        status: 'COMPLETED',
        primaryTopic: dbResult.primaryTopic,
        websiteUrl: '',
        createdAt: new Date().toISOString().split('T')[0],
        progressStage: 'COMPLETED',
        result: dbResult,
        error: null
      }
    });
  }

  return NextResponse.json(
    { success: false, error: 'Generation job not found' },
    { status: 404 }
  );
}
