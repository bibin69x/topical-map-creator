import crypto from 'crypto';

export class PaymentService {
  private webhookSecret: string;

  constructor() {
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!signature) return false;
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');
      const expectedBuffer = Buffer.from(expectedSignature);
      const signatureBuffer = Buffer.from(signature);
      if (expectedBuffer.length !== signatureBuffer.length) return false;
      return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    } catch (err) {
      console.error('Razorpay signature verification error:', err);
      return false;
    }
  }

}
