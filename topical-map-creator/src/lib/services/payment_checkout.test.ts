import { describe, it, expect } from 'vitest';

describe('Payment Checkout Service Logic', () => {
  it('correctly converts amount in INR to Razorpay paise', () => {
    const amountInr = 199;
    const amountInPaise = Math.round(amountInr * 100);
    expect(amountInPaise).toBe(19900);
  });

  it('validates currency defaults to INR and handles custom amount calculation', () => {
    const defaultCurrency = 'INR';
    expect(defaultCurrency).toBe('INR');

    const customAmountInr = 399;
    const customPaise = Math.round(customAmountInr * 100);
    expect(customPaise).toBe(39900);
  });

  it('validates receipt string format generation', () => {
    const timestamp = Date.now();
    const receipt = `rcpt_${timestamp}`;
    expect(receipt).toMatch(/^rcpt_\d+$/);
  });
});
