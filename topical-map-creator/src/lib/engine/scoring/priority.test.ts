import { describe, it, expect } from 'vitest';
import { calculatePriorityScore } from './priority';

describe('calculatePriorityScore', () => {
  it('assigns HIGH priority and score >= 70 to pillar topics with commercial intent', () => {
    const res = calculatePriorityScore({
      searchVolume: 2400,
      cpcInr: 50,
      depthLevel: 1,
      isPillar: true,
      intent: 'COMMERCIAL',
      confidenceScore: 90,
    });

    expect(res.priority).toBe('HIGH');
    expect(res.priorityScore).toBeGreaterThanOrEqual(70);
    expect(res.priorityScore).toBeLessThanOrEqual(100);
  });

  it('assigns LOW priority to deep topics with zero volume and low confidence', () => {
    const res = calculatePriorityScore({
      searchVolume: 0,
      cpcInr: 0,
      depthLevel: 4,
      isPillar: false,
      intent: 'NAVIGATIONAL',
      confidenceScore: 20,
    });

    expect(res.priority).toBe('LOW');
    expect(res.priorityScore).toBeLessThan(40);
  });

  it('correctly bounds score between 0 and 100', () => {
    const res = calculatePriorityScore({
      searchVolume: 100000,
      cpcInr: 1000,
      depthLevel: 1,
      isPillar: true,
      intent: 'TRANSACTIONAL',
      confidenceScore: 100,
    });

    expect(res.priorityScore).toBe(100);
    expect(res.priority).toBe('HIGH');
  });
});
