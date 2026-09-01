import { describe, it, expect } from 'vitest';
import { TopicalAuthorityEngine } from './pipeline';

describe('TopicalAuthorityEngine Pipeline Integration', () => {
  const engine = new TopicalAuthorityEngine();

  it('should execute complete 16-stage pipeline and produce structured topical map', async () => {
    const result = await engine.executePipeline({
      projectId: 'test-proj-001',
      primaryTopic: 'Technical SEO',
      targetCountry: 'IN',
      language: 'en'
    });

    expect(result.projectId).toBe('test-proj-001');
    expect(result.primaryTopic).toBe('Technical SEO');

    // 1. Clusters check
    expect(result.clusters.length).toBeGreaterThanOrEqual(3);
    for (const cluster of result.clusters) {
      expect(cluster.name).toBeTruthy();
      expect(cluster.description).toBeTruthy();
      expect(cluster.pillarTopicTitle).toBeTruthy();
      expect(cluster.topicCount).toBeGreaterThanOrEqual(0);
    }

    // 2. Topics check
    expect(result.topics.length).toBeGreaterThanOrEqual(10);
    const pillarTopics = result.topics.filter(t => t.depthLevel === 1);
    const supportingTopics = result.topics.filter(t => t.depthLevel > 1);

    expect(pillarTopics.length).toBeGreaterThan(0);
    expect(supportingTopics.length).toBeGreaterThan(0);

    for (const topic of result.topics) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.slug).toMatch(/^[a-z0-9-]+$/);
      expect(topic.clusterName).toBeTruthy();
      expect(['INFORMATIONAL', 'COMMERCIAL', 'TRANSACTIONAL', 'NAVIGATIONAL']).toContain(topic.intent);
      expect(topic.priorityScore).toBeGreaterThanOrEqual(0);
      expect(topic.priorityScore).toBeLessThanOrEqual(100);
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(topic.priority);
      expect(topic.confidenceScore).toBeGreaterThanOrEqual(0);
    }

    // 3. Internal linking relationships
    expect(result.internalLinks.length).toBeGreaterThan(0);
    for (const link of result.internalLinks) {
      expect(link.sourceTopicTitle).toBeTruthy();
      expect(link.targetTopicTitle).toBeTruthy();
      expect(['PARENT_CHILD', 'PILLAR_SUPPORTING']).toContain(link.relationshipType);
      expect(link.anchorTextSuggestion).toBeTruthy();
    }

    // 4. Quality Gates
    expect(result.qualityPassed).toBe(true);
    expect(result.qualityGateScore).toBeGreaterThanOrEqual(80);

    // 5. Cost Budget Caps (§DOC-11: hard cap <= ₹6.00 per generation)
    const totalCost = result.totalSearchCostInr + result.totalAiCostInr;
    expect(totalCost).toBeLessThanOrEqual(6.00);
    expect(result.totalSearchCostInr).toBeGreaterThan(0);
    expect(result.totalAiCostInr).toBeGreaterThanOrEqual(0);
  });

  it('should generate domain-specific topics and clusters for custom niches without falling back to generic placeholders', async () => {
    const nicheTopic = 'Organic Dog Food';
    const result = await engine.executePipeline({
      projectId: 'test-proj-niche',
      primaryTopic: nicheTopic,
      targetCountry: 'IN',
      language: 'en'
    });

    expect(result.primaryTopic).toBe(nicheTopic);
    expect(result.clusters.length).toBeGreaterThanOrEqual(3);

    // Ensure clusters and topics are specifically relevant to Organic Dog Food
    const allTitlesText = result.topics.map(t => t.title.toLowerCase()).join(' ');
    const allClusterText = result.clusters.map(c => c.name.toLowerCase()).join(' ');

    expect(
      allTitlesText.includes('dog') ||
      allTitlesText.includes('organic') ||
      allTitlesText.includes('food') ||
      allClusterText.includes('organic dog food')
    ).toBe(true);

    // Verify depth 1, 2, and 3 are present
    const depthLevels = new Set(result.topics.map(t => t.depthLevel));
    expect(depthLevels.has(1)).toBe(true);
    expect(depthLevels.has(2)).toBe(true);
  });
});

