import { z } from 'zod';

export type FeedbackCategory = 'QUALITY' | 'ACCURACY' | 'SPEED' | 'GENERAL';

export const feedbackSchema = z.object({
  generationId: z.string().optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  category: z.enum(['QUALITY', 'ACCURACY', 'SPEED', 'GENERAL']).default('GENERAL'),
  comments: z.string().max(1000, 'Comments cannot exceed 1000 characters').optional().default(''),
  userEmail: z.string().email().optional().or(z.literal(''))
});

export type FeedbackSubmission = z.infer<typeof feedbackSchema>;

export interface StoredFeedback extends FeedbackSubmission {
  id: string;
  createdAt: string;
}

// In-memory buffer for feedback telemetry during beta
export const feedbackStore: StoredFeedback[] = [
  {
    id: 'fb-demo-1',
    generationId: 'gen-demo-1',
    rating: 5,
    category: 'QUALITY',
    comments: 'The cluster breakdown and internal link suggestions saved me 3 hours of manual keyword clustering.',
    userEmail: 'seo.beta.user@example.com',
    createdAt: '2026-08-31T12:30:00.000Z'
  },
  {
    id: 'fb-demo-2',
    generationId: 'gen-demo-2',
    rating: 4,
    category: 'ACCURACY',
    comments: 'Very accurate intent mapping for commercial vs informational queries.',
    userEmail: 'freelancer.test@example.com',
    createdAt: '2026-08-31T14:15:00.000Z'
  }
];

export function recordFeedback(input: unknown): StoredFeedback {
  const validated = feedbackSchema.parse(input);
  const feedback: StoredFeedback = {
    ...validated,
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString()
  };

  feedbackStore.unshift(feedback);
  return feedback;
}

export function getFeedbackSummary() {
  const total = feedbackStore.length;
  if (total === 0) {
    return { total: 0, averageRating: 0, feedbackList: [] };
  }

  const sum = feedbackStore.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = Number((sum / total).toFixed(1));

  return {
    total,
    averageRating,
    feedbackList: feedbackStore.slice(0, 10)
  };
}
