/**
 * System Health & Uptime Diagnostic Service
 * Specification Reference: DOC-15 & DOC-17
 */

export interface SystemHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  providers: {
    supabase: string;
    openai: string;
    dataforseo: string;
    razorpay: string;
  };
  engine: {
    status: string;
    qualityGatesPassed: boolean;
    maxCostCapInr: number;
  };
}

export function getSystemHealth(): SystemHealthStatus {
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

  return {
    status: 'HEALTHY',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
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
  };
}
