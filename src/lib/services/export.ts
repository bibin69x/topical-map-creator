import { ProcessedTopic, TopicCluster, InternalLinkSuggestion } from '../engine/types';

export function generateTopicsCSV(topics: ProcessedTopic[]): string {
  const headers = ['Topic Title', 'Slug', 'Cluster', 'Search Intent', 'Priority Level', 'Priority Score', 'Parent Topic', 'Depth Level', 'Est Search Volume', 'Est CPC (INR)'];
  
  const rows = topics.map(t => [
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.slug}"`,
    `"${t.clusterName.replace(/"/g, '""')}"`,
    t.intent,
    t.priority,
    t.priorityScore,
    `"${(t.parentTitle || '').replace(/"/g, '""')}"`,
    t.depthLevel,
    t.searchVolume || 0,
    t.cpcInr || 0
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

generateTopicsCSV
