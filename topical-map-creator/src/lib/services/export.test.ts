import { describe, it, expect } from 'vitest';
import { generateTopicsCSV } from './export';
import { ProcessedTopic } from '../engine/types';

describe('generateTopicsCSV', () => {
  const sampleTopics: ProcessedTopic[] = [
    {
      id: 't1',
      title: 'Technical SEO Audit "Guide"',
      slug: 'technical-seo-audit-guide',
      clusterName: 'SEO & Audit',
      intent: 'COMMERCIAL',
      priority: 'HIGH',
      priorityScore: 92.5,
      parentTitle: 'SEO Core',
      depthLevel: 1,
      searchVolume: 2400,
      cpcInr: 45,
      confidenceScore: 90
    }
  ];

  it('generates properly formatted CSV header and rows with quotes escaping', () => {
    const csv = generateTopicsCSV(sampleTopics);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('Topic Title,Slug,Cluster,Search Intent,Priority Level,Priority Score,Parent Topic,Depth Level,Est Search Volume,Est CPC (INR)');
    expect(lines[1]).toContain('"Technical SEO Audit ""Guide"""');
    expect(lines[1]).toContain('"SEO & Audit"');
    expect(lines[1]).toContain('COMMERCIAL');
    expect(lines[1]).toContain('92.5');
  });
});
