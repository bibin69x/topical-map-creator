import { describe, it, expect } from 'vitest';
import { runQualityGates } from './quality_gates';
import { ProcessedTopic, TopicCluster, InternalLinkSuggestion } from '../types';

describe('runQualityGates', () => {
  const sampleTopics: ProcessedTopic[] = [
    { id: 't1', title: 'SEO Audit', slug: 'seo-audit', clusterName: 'Audit', intent: 'COMMERCIAL', priority: 'HIGH', priorityScore: 90, depthLevel: 1, confidenceScore: 90 },
    { id: 't2', title: 'Technical Audit', slug: 'technical-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'HIGH', priorityScore: 85, depthLevel: 2, confidenceScore: 90 },
    { id: 't3', title: 'On-Page Audit', slug: 'on-page-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 70, depthLevel: 2, confidenceScore: 85 },
    { id: 't4', title: 'Off-Page Audit', slug: 'off-page-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 65, depthLevel: 2, confidenceScore: 85 },
    { id: 't5', title: 'Local Audit', slug: 'local-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 60, depthLevel: 2, confidenceScore: 80 },
    { id: 't6', title: 'Mobile Audit', slug: 'mobile-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 60, depthLevel: 2, confidenceScore: 80 },
    { id: 't7', title: 'Speed Audit', slug: 'speed-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 60, depthLevel: 2, confidenceScore: 80 },
    { id: 't8', title: 'UX Audit', slug: 'ux-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 60, depthLevel: 2, confidenceScore: 80 },
    { id: 't9', title: 'Content Audit', slug: 'content-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 60, depthLevel: 2, confidenceScore: 80 },
    { id: 't10', title: 'Link Audit', slug: 'link-audit', clusterName: 'Audit', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 60, depthLevel: 2, confidenceScore: 80 },
  ];

  const sampleClusters: TopicCluster[] = [
    { id: 'c1', name: 'Audit', description: 'SEO Audits', pillarTopicTitle: 'SEO Audit', topicCount: 10 }
  ];

  const sampleLinks: InternalLinkSuggestion[] = [
    { sourceTopicTitle: 'Technical Audit', targetTopicTitle: 'SEO Audit', relationshipType: 'PARENT_CHILD', anchorTextSuggestion: 'Technical SEO Audit' }
  ];

  it('passes quality gates for valid topic list, cluster, and internal link graph', () => {
    const res = runQualityGates(sampleTopics, sampleClusters, sampleLinks);
    expect(res.qualityPassed).toBe(true);
    expect(res.qualityScore).toBe(100);
    expect(res.failureReasons).toHaveLength(0);
  });

  it('detects duplicate topic slugs and reduces score', () => {
    const duplicateTopics = [...sampleTopics, { ...sampleTopics[0], id: 't11' }];
    const res = runQualityGates(duplicateTopics, sampleClusters, sampleLinks);
    expect(res.failureReasons.some(r => r.includes('duplicate topic slugs'))).toBe(true);
    expect(res.qualityScore).toBeLessThan(100);
  });

  it('fails quality gates when topics are fewer than 10', () => {
    const res = runQualityGates(sampleTopics.slice(0, 5), sampleClusters, sampleLinks);
    expect(res.qualityPassed).toBe(false);
    expect(res.failureReasons.some(r => r.includes('minimum'))).toBe(true);
  });
});
