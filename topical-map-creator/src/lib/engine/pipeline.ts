import { DataForSEOProvider } from './providers/dataforseo';
import { AIRouter } from './ai/router';
import { calculatePriorityScore } from './scoring/priority';
import { runQualityGates } from './validation/quality_gates';
import { sanitizeUserInput } from './ai/sanitization';
import { GenerationInput, EngineResult, ProcessedTopic, TopicCluster, InternalLinkSuggestion } from './types';

export class TopicalAuthorityEngine {
  private dataProvider: DataForSEOProvider;
  private aiRouter: AIRouter;

  constructor() {
    this.dataProvider = new DataForSEOProvider();
    this.aiRouter = new AIRouter();
  }

  public async executePipeline(input: GenerationInput): Promise<EngineResult> {
    const cleanPrimaryTopic = sanitizeUserInput(input.primaryTopic);
    console.log(`[TopicalEngine] Executing pipeline for topic: "${cleanPrimaryTopic}"`);

    // Stage 1 & 2: Candidate Topic Expansion
    const { candidates, costInr: searchCostInr } = await this.dataProvider.getCandidateTopics(
      cleanPrimaryTopic,
      input.targetCountry
    );

    const candidateTitles = candidates.map(c => c.title);

    // Stage 3 & 4: AI Semantic Clustering & Intent Reasoning
    const { clusters: rawClusters, categorizedTopics, aiCostInr } = await this.aiRouter.generateClustersAndIntent(
      cleanPrimaryTopic,
      candidateTitles
    );

    // Stage 5 & 6: Hierarchy Building & Priority Scoring
    const processedTopics: ProcessedTopic[] = categorizedTopics.map((catTopic, idx) => {
      const candidateMatch = candidates.find(c => c.normalizedTitle === catTopic.title.toLowerCase().trim());
      const isPillar = catTopic.depthLevel === 1;

      const searchVolume = catTopic.searchVolume || candidateMatch?.searchVolume || (isPillar ? 4800 : 1400);
      const cpcInr = catTopic.cpcInr || candidateMatch?.cpcInr || (catTopic.intent === 'COMMERCIAL' || catTopic.intent === 'TRANSACTIONAL' ? 48 : 22);

      const { priorityScore, priority } = calculatePriorityScore({
        searchVolume,
        cpcInr,
        depthLevel: catTopic.depthLevel,
        isPillar,
        intent: catTopic.intent,
        confidenceScore: 88.0
      });

      return {
        id: `topic-${idx + 1}`,
        title: catTopic.title,
        slug: catTopic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        clusterName: catTopic.clusterName,
        intent: catTopic.intent,
        priority,
        priorityScore,
        parentTitle: catTopic.parentTitle,
        depthLevel: catTopic.depthLevel,
        searchVolume,
        cpcInr,
        confidenceScore: 88.0
      };
    });

    // Format Topic Clusters
    const topicClusters: TopicCluster[] = rawClusters.map((cluster, idx) => {
      const count = processedTopics.filter(t => t.clusterName === cluster.name).length;
      return {
        id: `cluster-${idx + 1}`,
        name: cluster.name,
        description: cluster.description,
        pillarTopicTitle: cluster.pillarTopicTitle,
        topicCount: count
      };
    });

    // Stage 7: Internal Link Suggestions Generation
    const internalLinks: InternalLinkSuggestion[] = [];
    for (const topic of processedTopics) {
      if (topic.parentTitle) {
        internalLinks.push({
          sourceTopicTitle: topic.title,
          targetTopicTitle: topic.parentTitle,
          relationshipType: 'PARENT_CHILD',
          anchorTextSuggestion: `Comprehensive guide to ${topic.parentTitle}`
        });
      } else {
        // Link to cluster pillar if available
        const cluster = topicClusters.find(c => c.name === topic.clusterName);
        if (cluster && cluster.pillarTopicTitle && cluster.pillarTopicTitle !== topic.title) {
          internalLinks.push({
            sourceTopicTitle: topic.title,
            targetTopicTitle: cluster.pillarTopicTitle,
            relationshipType: 'PILLAR_SUPPORTING',
            anchorTextSuggestion: `Explore our pillar on ${cluster.pillarTopicTitle}`
          });
        }
      }
    }

    // Stage 8: Quality Gates Validation
    const qualityResult = runQualityGates(processedTopics, topicClusters, internalLinks);

    return {
      projectId: input.projectId,
      primaryTopic: input.primaryTopic,
      clusters: topicClusters,
      topics: processedTopics,
      internalLinks,
      qualityPassed: qualityResult.qualityPassed,
      qualityGateScore: qualityResult.qualityScore,
      totalSearchCostInr: searchCostInr,
      totalAiCostInr: aiCostInr
    };
  }
}
