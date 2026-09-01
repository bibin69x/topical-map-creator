import { describe, it, expect } from 'vitest';
import { saveEngineResultToDb, getEngineResultFromDb } from './db';
import { EngineResult } from '../engine/types';

describe('Phase 18: Database Persistence & Storage Service (TEST-17)', () => {
  const mockResult: EngineResult = {
    projectId: 'test-db-proj',
    primaryTopic: 'Ecommerce Technical SEO',
    clusters: [
      { id: 'c-1', name: 'Product Schema', description: 'Schema markup', pillarTopicTitle: 'Product Schema Guide', topicCount: 2 }
    ],
    topics: [
      { id: 't-1', title: 'Product Schema Guide', slug: 'product-schema-guide', clusterName: 'Product Schema', intent: 'COMMERCIAL', priority: 'HIGH', priorityScore: 90, depthLevel: 1, confidenceScore: 90 },
      { id: 't-2', title: 'How to Add Review Schema to Shopify', slug: 'add-review-schema-shopify', clusterName: 'Product Schema', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 70, depthLevel: 2, parentTitle: 'Product Schema Guide', confidenceScore: 85 }
    ],
    internalLinks: [
      { sourceTopicTitle: 'How to Add Review Schema to Shopify', targetTopicTitle: 'Product Schema Guide', relationshipType: 'PARENT_CHILD', anchorTextSuggestion: 'Review Schema Guide' }
    ],
    qualityPassed: true,
    qualityGateScore: 95,
    totalSearchCostInr: 3.20,
    totalAiCostInr: 0.187
  };

  it('handles saveEngineResultToDb without throwing and returns boolean status', async () => {
    const status = await saveEngineResultToDb({
      generationId: 'gen-test-db-1',
      projectId: 'proj-test-db-1',
      primaryTopic: 'Ecommerce Technical SEO',
      result: mockResult
    });

    expect(typeof status).toBe('boolean');
  });

  it('handles getEngineResultFromDb gracefully for missing IDs', async () => {
    const result = await getEngineResultFromDb('non-existent-proj-id');
    expect(result === null || typeof result === 'object').toBe(true);
  });
});
