export type IntentType = 'INFORMATIONAL' | 'COMMERCIAL' | 'TRANSACTIONAL' | 'NAVIGATIONAL';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type RelationshipType = 'PARENT_CHILD' | 'PILLAR_SUPPORTING' | 'RELATED_CLUSTER';

export interface CandidateTopic {
  id: string;
  title: string;
  slug: string;
  source: 'EXPANSION' | 'SERP' | 'AI';
  searchVolume?: number;
  cpcInr?: number;
  embedding?: number[];
  normalizedTitle: string;
}

export interface ProcessedTopic {
  id: string;
  title: string;
  slug: string;
  clusterName: string;
  intent: IntentType;
  priority: PriorityLevel;
  priorityScore: number; // 0.0 - 100.0
  parentTitle?: string;
  depthLevel: number;
  searchVolume?: number;
  cpcInr?: number;
  confidenceScore: number; // 0.0 - 100.0
}

export interface TopicCluster {
  id: string;
  name: string;
  description: string;
  pillarTopicTitle: string;
  topicCount: number;
}

export interface InternalLinkSuggestion {
  sourceTopicTitle: string;
  targetTopicTitle: string;
  relationshipType: RelationshipType;
  anchorTextSuggestion: string;
}

export interface GenerationInput {
  projectId: string;
  primaryTopic: string;
  websiteUrl?: string;
  targetCountry: string;
  language: string;
}

export interface EngineResult {
  projectId: string;
  primaryTopic: string;
  clusters: TopicCluster[];
  topics: ProcessedTopic[];
  internalLinks: InternalLinkSuggestion[];
  qualityPassed: boolean;
  qualityGateScore: number;
  totalSearchCostInr: number;
  totalAiCostInr: number;
}
