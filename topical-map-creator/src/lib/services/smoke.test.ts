import { describe, it, expect } from 'vitest';
import { calculateEntitlementState, getPostGenerationConversionMessage } from './entitlement';
import { TopicalAuthorityEngine } from '../engine/pipeline';
import { generateTopicsCSV } from './export';
import { PaymentService, createPaymentOrderReceipt } from './payment';
import { recordFeedback, getFeedbackSummary } from './feedback';
import { executeAccountDeletion, UserAccountDataStore } from './account';
import crypto from 'crypto';

describe('Phase 15: Full User Lifecycle Smoke Test (TEST-13)', () => {
  const userId = 'smoke-user-999';
  const projectId = 'smoke-proj-001';
  const primaryTopic = 'B2B SaaS Content Marketing';

  it('executes complete end-to-end user lifecycle from onboarding to generation, monetization, and deletion', async () => {
    // 1. User Registration & Initial Free Entitlement Allocation (§40 & §DOC-07)
    let credits = 1;
    let isPaid = false;
    let entitlement = calculateEntitlementState(credits, isPaid);

    expect(entitlement.creditsRemaining).toBe(1);
    expect(entitlement.isPaid).toBe(false);
    expect(entitlement.canGenerate).toBe(true);

    // 2. Consume 1 Credit & Execute 16-Stage Topical Engine Pipeline (§DOC-08)
    credits -= 1;
    entitlement = calculateEntitlementState(credits, isPaid);
    expect(entitlement.canGenerate).toBe(false);

    const engine = new TopicalAuthorityEngine();
    const result = await engine.executePipeline({
      projectId,
      primaryTopic,
      targetCountry: 'IN',
      language: 'en'
    });

    // Verify Engine Output Quality & Safety
    expect(result.primaryTopic).toBe(primaryTopic);
    expect(result.qualityPassed).toBe(true);
    expect(result.qualityGateScore).toBeGreaterThanOrEqual(80);
    expect(result.clusters.length).toBeGreaterThanOrEqual(3);
    expect(result.topics.length).toBeGreaterThan(0);
    expect(result.internalLinks.length).toBeGreaterThan(0);

    // Economic cap verification (search + AI <= ₹6.00)
    const variableCost = result.totalSearchCostInr + result.totalAiCostInr;
    expect(variableCost).toBeLessThanOrEqual(6.00);

    // 3. Export Service: Generate CSV Output (§DOC-06)
    const csvContent = generateTopicsCSV(result.topics);
    expect(csvContent).toContain('Topic Title,Slug,Cluster,Search Intent,Priority Level');
    expect(csvContent).toContain(result.topics[0].slug);

    // 4. Upgrade Prompt on Free Credit Exhaustion (§DOC-13)
    const conversionNotice = getPostGenerationConversionMessage(isPaid, credits);
    expect(conversionNotice).toContain('Unlock 9 more complete topical maps + CSV/PDF exports for just ₹199');

    // 5. Razorpay Checkout & Webhook Verification (§DOC-13)
    const orderReceipt = createPaymentOrderReceipt(userId);
    expect(orderReceipt.amountPaise).toBe(19900); // ₹199 in paise

    const webhookSecret = 'test_smoke_secret';
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    const paymentService = new PaymentService();

    const webhookPayload = JSON.stringify({
      event: 'order.paid',
      payload: {
        payment: {
          entity: {
            id: 'pay_smoke_12345',
            order_id: orderReceipt.receiptId,
            amount: 19900,
            status: 'captured'
          }
        }
      }
    });

    const validSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookPayload)
      .digest('hex');

    const signatureValid = paymentService.verifyWebhookSignature(webhookPayload, validSignature);
    expect(signatureValid).toBe(true);

    // Grant 10 paid credits upon verified webhook
    credits += 10;
    isPaid = true;
    entitlement = calculateEntitlementState(credits, isPaid);
    expect(entitlement.creditsRemaining).toBe(10);
    expect(entitlement.isPaid).toBe(true);
    expect(entitlement.canGenerate).toBe(true);

    // 6. User Feedback Submission (§DOC-15 & Phase 14)
    const feedback = recordFeedback({
      generationId: projectId,
      rating: 5,
      category: 'QUALITY',
      comments: 'Outstanding topical hierarchy and actionable internal linking structure!',
      userEmail: 'smoke.tester@agency.in'
    });

    expect(feedback.id).toBeTruthy();
    expect(feedback.rating).toBe(5);
    const summary = getFeedbackSummary();
    expect(summary.total).toBeGreaterThan(0);
    expect(summary.averageRating).toBeGreaterThanOrEqual(1.0);

    // 7. Cascade Account Deletion & GST Audit Anonymization (§DOC-16)
    const store: UserAccountDataStore = {
      projects: [{ id: projectId, userId }],
      generations: [{ id: 'gen-smoke-001', userId }],
      payments: [{ id: 'pay-db-1', userId, amountInr: 199, orderId: orderReceipt.receiptId }],
      profiles: [{ id: 'prof-smoke-1', userId }],
      entitlements: [{ id: 'ent-smoke-1', userId }]
    };

    const deletionResult = executeAccountDeletion(userId, store);
    expect(deletionResult.success).toBe(true);
    expect(deletionResult.projectsDeleted).toBe(1);
    expect(deletionResult.generationsDeleted).toBe(1);
    expect(deletionResult.paymentsAnonymized).toBe(1);

    // Ensure user data purged from store
    expect(store.projects.length).toBe(0);
    expect(store.generations.length).toBe(0);
    expect(store.entitlements.length).toBe(0);
    // Payment record retained with userId = null for 8-year statutory compliance
    expect(store.payments[0].userId).toBeNull();
    expect(store.payments[0].amountInr).toBe(199);
  });
});
