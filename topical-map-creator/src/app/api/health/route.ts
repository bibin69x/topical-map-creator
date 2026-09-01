import { NextResponse } from 'next/server';
import { getSystemHealth } from '@/lib/services/health';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const health = getSystemHealth();
  const latencyMs = Date.now() - startTime;

  return NextResponse.json({
    ...health,
    latencyMs
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

