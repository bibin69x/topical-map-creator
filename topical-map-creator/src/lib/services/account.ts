/**
 * Account & Data Deletion Service
 * Specification: DOC-16 §5, DOC-06 §3, & PROJECT_CONTEXT.md §32
 */

export interface AccountDeletionResult {
  success: boolean;
  userId: string;
  projectsDeleted: number;
  generationsDeleted: number;
  paymentsAnonymized: number;
  deletedAt: string;
}

export interface UserAccountDataStore {
  projects: Array<{ id: string; userId: string }>;
  generations: Array<{ id: string; userId: string }>;
  payments: Array<{ id: string; userId: string | null; amountInr: number; orderId: string }>;
  profiles: Array<{ id: string; userId: string }>;
  entitlements: Array<{ id: string; userId: string }>;
}

/**
 * Executes cascading account deletion and tax anonymization.
 * 1. Cascade deletes projects, generations, and user profile data.
 * 2. Anonymizes payment records (user_id = null) preserving financial records for tax/GST compliance.
 */
export function executeAccountDeletion(
  userId: string,
  store: UserAccountDataStore
): AccountDeletionResult {
  if (!userId) {
    throw new Error('User ID is required for account deletion');
  }

  const initialProjectsCount = store.projects.filter(p => p.userId === userId).length;
  const initialGenerationsCount = store.generations.filter(g => g.userId === userId).length;
  const initialPaymentsCount = store.payments.filter(p => p.userId === userId).length;

  // 1. Cascade delete project entities
  store.projects = store.projects.filter(p => p.userId !== userId);
  store.generations = store.generations.filter(g => g.userId !== userId);
  store.profiles = store.profiles.filter(p => p.userId !== userId);
  store.entitlements = store.entitlements.filter(e => e.userId !== userId);

  // 2. Anonymize payment logs for tax / GST audit retention (§32 & DOC-16)
  store.payments = store.payments.map(payment => {
    if (payment.userId === userId) {
      return {
        ...payment,
        userId: null // Anonymized: transaction ID & amount retained, user association severed
      };
    }
    return payment;
  });

  return {
    success: true,
    userId,
    projectsDeleted: initialProjectsCount,
    generationsDeleted: initialGenerationsCount,
    paymentsAnonymized: initialPaymentsCount,
    deletedAt: new Date().toISOString()
  };
}
