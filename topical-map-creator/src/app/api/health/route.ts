import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
  );

  const isOpenAIConfigured = Boolean(
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY.startsWith('sk-')
  );

  const isDataForSEOConfigured = Boolean(
    process.env.DATAFORSEO_API_LOGIN &&
    process.env.DATAFORSEO_API_LOGIN !== 'your-login'
  );

  const isRazorpayConfigured = Boolean(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
    !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes('your_key_id')
  );

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json({
    status: 'HEALTHY',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    latencyMs: responseTimeMs,
    environment: process.env.NODE_ENV || 'production',
    providers: {
      supabase: isSupabaseConfigured ? 'READY' : 'SANDBOX_FALLBACK',
      openai: isOpenAIConfigured ? 'READY' : 'DETERMINISTIC_FALLBACK',
      dataforseo: isDataForSEOConfigured ? 'READY' : 'SEED_EXPANSION_FALLBACK',
      razorpay: isRazorpayConfigured ? 'READY' : 'SANDBOX_MODE'
    },
    engine: {
      status: 'OPERATIONAL',
      qualityGatesPassed: true,
      maxCostCapInr: 6.00
    }
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
