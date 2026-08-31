import { describe, it, expect } from 'vitest';
import { recordFeedback, getFeedbackSummary, feedbackSchema } from './feedback';

describe('Beta Feedback Service', () => {
  it('should accept valid feedback submission with rating and comments', () => {
    const feedback = recordFeedback({
      generationId: 'gen-test-01',
      rating: 5,
      category: 'QUALITY',
      comments: 'Great topic clustering!',
      userEmail: 'beta@example.com'
    });

    expect(feedback.id).toMatch(/^fb-/);
    expect(feedback.rating).toBe(5);
    expect(feedback.category).toBe('QUALITY');
    expect(feedback.comments).toBe('Great topic clustering!');
    expect(feedback.createdAt).toBeTruthy();
  });

  it('should reject invalid ratings out of 1-5 range', () => {
    expect(() => recordFeedback({ rating: 6 })).toThrow();
    expect(() => recordFeedback({ rating: 0 })).toThrow();
    expect(() => recordFeedback({ rating: -1 })).toThrow();
  });

  it('should calculate average rating and summary correctly', () => {
    const summary = getFeedbackSummary();
    expect(summary.total).toBeGreaterThan(0);
    expect(summary.averageRating).toBeGreaterThanOrEqual(1);
    expect(summary.averageRating).toBeLessThanOrEqual(5);
    expect(Array.isArray(summary.feedbackList)).toBe(true);
  });
});
