import { NextResponse } from 'next/server';
import { recordFeedback, getFeedbackSummary } from '@/lib/services/feedback';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const feedback = recordFeedback(body);

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid feedback payload' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const summary = getFeedbackSummary();
    return NextResponse.json({
      success: true,
      data: summary
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve feedback summary' },
      { status: 500 }
    );
  }
}
