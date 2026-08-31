import { ProcessedTopic, TopicCluster, InternalLinkSuggestion } from '../types';

export function runQualityGates(
  topics: ProcessedTopic[],
  clusters: TopicCluster[],
  links: InternalLinkSuggestion[]
): { qualityPassed: boolean; qualityScore: number; failureReasons: string[] } {
  const failureReasons: string[] = [];
  let score = 100;

  // 1. Minimum Topic Count Check
  if (topics.length < 10) {
    failureReasons.push(`Insufficient topic volume (${topics.length} topics < 10 minimum).`);
    score -= 25;
  }

  // 2. Cluster Presence Check
  if (clusters.length === 0) {
    failureReasons.push('Zero topical clusters generated.');
    score -= 30;
  }

  // 3. Duplicate Topic Detection
  const slugs = new Set<string>();
  let duplicates = 0;
  for (const topic of topics) {
    if (slugs.has(topic.slug)) {
      duplicates++;
    } else {
      slugs.add(topic.slug);
    }
  }
  if (duplicates > 0) {
    failureReasons.push(`Found ${duplicates} duplicate topic slugs.`);
    score -= duplicates * 5;
  }

  // 4. Maximum Hierarchy Depth Check
  const maxDepth = Math.max(...topics.map(t => t.depthLevel), 1);
  if (maxDepth > 4) {
    failureReasons.push(`Hierarchy depth exceeds maximum safe limit (${maxDepth} > 4).`);
    score -= 15;
  }

  // 5. Internal Link Relationship Check
  if (links.length === 0 && topics.length > 5) {
    failureReasons.push('No internal linking graph suggestions generated.');
    score -= 20;
  }

  const finalScore = Math.max(0, score);
  const qualityPassed = finalScore >= 70 && failureReasons.length < 3;

  return {
    qualityPassed,
    qualityScore: finalScore,
    failureReasons
  };
}
