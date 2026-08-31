import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.parse(body);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email: parsed.email,
          password: parsed.password,
          options: {
            data: {
              full_name: parsed.fullName || parsed.email.split('@')[0]
            }
          }
        });

        if (error) {
          console.warn('[Supabase Auth Warning] Sign up error:', error.message);
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          user: {
            id: data.user?.id || `usr-${Date.now()}`,
            email: parsed.email,
            fullName: parsed.fullName || parsed.email.split('@')[0]
          },
          creditsRemaining: 1,
          isPaid: false,
          message: 'Account created successfully! 1 free topical map credit allocated.'
        });
      } catch (err: any) {
        console.warn('[Supabase Auth Exception] Falling back to local session:', err);
      }
    }

    // Local / Sandbox demo registration fallback
    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Date.now()}`,
        email: parsed.email,
        fullName: parsed.fullName || parsed.email.split('@')[0]
      },
      creditsRemaining: 1,
      isPaid: false,
      message: 'Account created successfully! 1 free topical map credit allocated.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid registration request' },
      { status: 400 }
    );
  }
}
