import { describe, it, expect } from 'vitest';
import { PaymentService } from './payment';
import crypto from 'crypto';

describe('PaymentService', () => {
  const service = new PaymentService();
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';

  it('validates a correct HMAC-SHA256 Razorpay webhook signature', () => {
    const payload = JSON.stringify({ event: 'payment.captured', amount: 19900 });
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const isValid = service.verifyWebhookSignature(payload, validSignature);
    expect(isValid).toBe(true);
  });

  it('rejects an invalid or forged webhook signature', () => {
    const payload = JSON.stringify({ event: 'payment.captured', amount: 19900 });
    const forgedSignature = 'forged_signature_hash_1234567890abcdef1234567890abcdef12345678';

    const isValid = service.verifyWebhookSignature(payload, forgedSignature);
    expect(isValid).toBe(false);
  });

  it('returns false when signature is empty', () => {
    const payload = JSON.stringify({ event: 'payment.captured' });
    const isValid = service.verifyWebhookSignature(payload, '');
    expect(isValid).toBe(false);
  });
});
