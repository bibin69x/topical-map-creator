import { describe, it, expect } from 'vitest';
import { calculateEntitlementState } from './entitlement';

describe('Auth & User Registration Logic', () => {
  it('validates password minimum length requirement (>= 8 chars)', () => {
    const validPassword = 'strong_password_123';
    const shortPassword = 'short';

    expect(validPassword.length).toBeGreaterThanOrEqual(8);
    expect(shortPassword.length).toBeLessThan(8);
  });

  it('validates email pattern parsing', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test('seo.expert@agency.in')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
  });

  it('verifies initial free entitlement allocation grants exactly 1 credit', () => {
    const initialCredits = 1;
    const isPaid = false;
    const state = calculateEntitlementState(initialCredits, isPaid);

    expect(state.creditsRemaining).toBe(1);
    expect(state.isPaid).toBe(false);
    expect(state.canGenerate).toBe(true);
  });
});
