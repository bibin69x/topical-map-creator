/**
 * Operational Telemetry & Business Milestone Service
 * Specification: V1 Blueprint §33, §34 & DOC-15
 */

export interface MilestoneProgress {
  m1_goal: number;
  m1_progress: number;
  m2_goal: number;
  m2_progress: number;
  m3_goal: number;
  m3_progress: number;
  m4_target_customers: number;
  m4_target_revenue_inr: number;
  m4_revenue_progress: number;
}

export function calculateMilestones(paidCustomersCount: number): MilestoneProgress {
  const m1Goal = 20;
  const m2Goal = 100;
  const m3Goal = 1000;
  const m4Customers = 10000;
  const m4RevenueInr = 1990000; // 10,000 customers * ₹199

  const grossRevenue = paidCustomersCount * 199;

  return {
    m1_goal: m1Goal,
    m1_progress: Math.min(100, Number(((paidCustomersCount / m1Goal) * 100).toFixed(1))),
    m2_goal: m2Goal,
    m2_progress: Math.min(100, Number(((paidCustomersCount / m2Goal) * 100).toFixed(1))),
    m3_goal: m3Goal,
    m3_progress: Math.min(100, Number(((paidCustomersCount / m3Goal) * 100).toFixed(2))),
    m4_target_customers: m4Customers,
    m4_target_revenue_inr: m4RevenueInr,
    m4_revenue_progress: Math.min(100, Number(((grossRevenue / m4RevenueInr) * 100).toFixed(3)))
  };
}

export function evaluateCapHealth(avgCostInr: number, hardCapInr: number = 6.00): 'OPTIMAL' | 'WARNING' | 'BREACHED' {
  if (avgCostInr <= 4.50) return 'OPTIMAL';
  if (avgCostInr <= hardCapInr) return 'WARNING';
  return 'BREACHED';
}
