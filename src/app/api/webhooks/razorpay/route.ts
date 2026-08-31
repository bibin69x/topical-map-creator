import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/payment';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const paymentService = new PaymentService();
    const isValid = paymentService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    if (payload.event === 'payment.captured') {
      console.log('[Razorpay Webhook] Payment captured successfully. Granting 10 credits.');
      // In production DB: Grant +10 credits to user profile
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
