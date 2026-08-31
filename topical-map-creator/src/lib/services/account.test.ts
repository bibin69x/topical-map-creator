import { describe, it, expect } from 'vitest';
import { executeAccountDeletion, UserAccountDataStore } from './account';

describe('DOC-16: Account Cascade Deletion & Tax Anonymization', () => {
  it('cascades deletion of projects, generations, and entitlements while retaining anonymized payments', () => {
    const mockStore: UserAccountDataStore = {
      projects: [
        { id: 'proj-1', userId: 'user-abc' },
        { id: 'proj-2', userId: 'user-abc' },
        { id: 'proj-3', userId: 'user-other' }
      ],
      generations: [
        { id: 'gen-1', userId: 'user-abc' },
        { id: 'gen-2', userId: 'user-other' }
      ],
      payments: [
        { id: 'pay-1', userId: 'user-abc', amountInr: 199, orderId: 'order_123' },
        { id: 'pay-2', userId: 'user-other', amountInr: 199, orderId: 'order_456' }
      ],
      profiles: [
        { id: 'prof-1', userId: 'user-abc' },
        { id: 'prof-2', userId: 'user-other' }
      ],
      entitlements: [
        { id: 'ent-1', userId: 'user-abc' }
      ]
    };

    const result = executeAccountDeletion('user-abc', mockStore);

    expect(result.success).toBe(true);
    expect(result.projectsDeleted).toBe(2);
    expect(result.generationsDeleted).toBe(1);
    expect(result.paymentsAnonymized).toBe(1);

    // Verify projects of user-abc are deleted
    expect(mockStore.projects.some(p => p.userId === 'user-abc')).toBe(false);
    expect(mockStore.projects.length).toBe(1); // user-other remains

    // Verify generations of user-abc are deleted
    expect(mockStore.generations.some(g => g.userId === 'user-abc')).toBe(false);

    // Verify entitlements of user-abc are deleted
    expect(mockStore.entitlements.some(e => e.userId === 'user-abc')).toBe(false);

    // Verify payments are anonymized, NOT deleted (for GST statutory compliance)
    expect(mockStore.payments.length).toBe(2);
    const anonymizedPayment = mockStore.payments.find(p => p.orderId === 'order_123');
    expect(anonymizedPayment).toBeDefined();
    expect(anonymizedPayment?.userId).toBeNull();
    expect(anonymizedPayment?.amountInr).toBe(199);
  });

  it('rejects execution if userId is missing', () => {
    const mockStore: UserAccountDataStore = {
      projects: [],
      generations: [],
      payments: [],
      profiles: [],
      entitlements: []
    };

    expect(() => executeAccountDeletion('', mockStore)).toThrow();
  });
});
