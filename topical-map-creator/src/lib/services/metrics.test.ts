import { describe, it, expect } from 'vitest';
import { calculateMilestones, evaluateCapHealth } from './metrics';

describe('V1 Customer Milestones & Health Evaluation (§33 & §34)', () => {
  it('correctly calculates customer progress towards milestones', () => {
    const paidUsers = 12;
    const milestones = calculateMilestones(paidUsers);

    expect(milestones.m1_goal).toBe(20);
    expect(milestones.m1_progress).toBe(60.0); // 12/20 = 60%

    expect(milestones.m2_goal).toBe(100);
    expect(milestones.m2_progress).toBe(12.0); // 12/100 = 12%

    expect(milestones.m3_goal).toBe(1000);
    expect(milestones.m3_progress).toBe(1.20); // 12/1000 = 1.2%

    expect(milestones.m4_target_customers).toBe(10000);
    expect(milestones.m4_target_revenue_inr).toBe(1990000);
    expect(milestones.m4_revenue_progress).toBeGreaterThan(0);
  });

  it('clamps milestone progress to maximum of 100%', () => {
    const exceededPaidUsers = 25000;
    const milestones = calculateMilestones(exceededPaidUsers);

    expect(milestones.m1_progress).toBe(100);
    expect(milestones.m2_progress).toBe(100);
    expect(milestones.m3_progress).toBe(100);
    expect(milestones.m4_revenue_progress).toBe(100);
  });

  it('evaluates budget cap health status categories', () => {
    expect(evaluateCapHealth(3.20)).toBe('OPTIMAL');
    expect(evaluateCapHealth(4.50)).toBe('OPTIMAL');
    expect(evaluateCapHealth(5.20)).toBe('WARNING');
    expect(evaluateCapHealth(6.50)).toBe('BREACHED');
  });
});
