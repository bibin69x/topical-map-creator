// Entitlement Service — Manages user credits and transactional refunds (§DOC-07 & DOC-11)

export interface EntitlementState {
  creditsRemaining: number;
  isPaid: boolean;
  canGenerate: boolean;
}

export function calculateEntitlementState(creditsRemaining: number, isPaid: boolean): EntitlementState {
  return {
    creditsRemaining,
    isPaid,
    canGenerate: creditsRemaining > 0
  };
}

export function getPostGenerationConversionMessage(isPaid: boolean, creditsRemaining: number): string | null {
  if (!isPaid && creditsRemaining <= 0) {
    return "Your free topical map is ready! Unlock 9 more complete topical maps + CSV/PDF exports for just ₹199.";
  }
  return null;
}
