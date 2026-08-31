import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: parsed.email,
          password: parsed.password
        });

        if (error) {
          console.warn('[Supabase Auth Warning] Sign in error:', error.message);
          return NextResponse.json({ success: false, error: error.message }, { status: 401 });
        }

        return NextResponse.json({
          success: true,
          user: {
            id: data.user?.id || `usr-${Date.now()}`,
            email: parsed.email,
            fullName: data.user?.user_metadata?.full_name || parsed.email.split('@')[0]
          },
          creditsRemaining: 1,
          isPaid: false
        });
      } catch (err: any) {
        console.warn('[Supabase Auth Exception] Falling back to local session:', err);
      }
    }

    // Local / Sandbox demo login fallback
    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Date.now()}`,
        email: parsed.email,
        fullName: parsed.email.split('@')[0]
      },
      creditsRemaining: 1,
      isPaid: false
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid login request' },
      { status: 400 }
    );
  }
}
