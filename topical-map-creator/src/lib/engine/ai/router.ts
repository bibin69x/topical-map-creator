import { IntentType } from '../types';
import { sanitizeSearchDataForPrompt, sanitizeUserInput } from './sanitization';

export interface GeneratedTopicOutput {
  title: string;
  clusterName: string;
  intent: IntentType;
  parentTitle?: string;
  depthLevel: number;
  searchVolume?: number;
  cpcInr?: number;
}

export interface GeneratedClusterOutput {
  name: string;
  description: string;
  pillarTopicTitle: string;
}

export class AIRouter {
  private apiKey?: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
  }

  public async generateClustersAndIntent(
    primaryTopic: string,
    candidateTitles: string[] = []
  ): Promise<{
    clusters: GeneratedClusterOutput[];
    categorizedTopics: GeneratedTopicOutput[];
    aiCostInr: number;
  }> {
    const cleanPrimary = sanitizeUserInput(primaryTopic);
    const isolatedSearchXml = candidateTitles.length > 0 
      ? sanitizeSearchDataForPrompt(candidateTitles)
      : '<untrusted_search_data>None provided</untrusted_search_data>';

    if (this.apiKey && this.apiKey.startsWith('sk-')) {
      try {
        const prompt = `
You are a world-class SEO Topical Authority Architect building an actionable, comprehensive Topical Map for the niche: "${cleanPrimary}".

Search candidate signals for context:
${isolatedSearchXml}

YOUR MISSION:
Build a complete, professional, publication-ready Topical Authority Architecture with 4 to 6 distinct content clusters and 25 to 35 highly specific, non-redundant topics that an SEO team can immediately execute.

RULES FOR MAXIMUM QUALITY (AVOID VAGUE SLOP):
1. NO generic placeholder titles like "${cleanPrimary} 101" or "${cleanPrimary} Strategy". Every topic MUST be an actual, publication-ready headline or keyword (e.g. if topic is "Technical SEO", use "How to Perform a Comprehensive Crawlability Audit", "Optimizing INP & Core Web Vitals for E-commerce", "Handling Faceted Navigation Canonicalization").
2. Create 4 to 6 distinct Clusters (e.g., Fundamentals & Architecture, Implementation & Workflows, Tools & Software Evaluation, Troubleshooting & Auditing, Advanced Strategies & Case Studies).
3. For each cluster, define:
   - "name": Clean, descriptive cluster name
   - "description": 1-2 sentence explanation of the cluster scope
   - "pillarTopicTitle": The primary Level 1 Pillar Guide for that cluster
4. For every topic in "categorizedTopics", provide:
   - "title": Specific, compelling article title
   - "clusterName": Exact match to one of the clusters
   - "intent": "INFORMATIONAL" | "COMMERCIAL" | "TRANSACTIONAL" | "NAVIGATIONAL"
   - "depthLevel": 1 (Pillar Guide), 2 (Cluster Guide), or 3 (Long-Tail / Supporting / FAQ)
   - "parentTitle": Parent topic title (Level 2 topics map to Level 1 pillar; Level 3 topics map to Level 2 topic; Level 1 has null)
   - "searchVolume": Realistic monthly search volume estimate (300 to 18,000)
   - "cpcInr": Realistic Google Ads CPC estimate in INR (10.0 to 120.0 based on commerciality)

OUTPUT FORMAT:
Return strictly valid JSON only (no markdown quotes, no explanations):
{
  "clusters": [
    {
      "name": "Cluster Name",
      "description": "Cluster description",
      "pillarTopicTitle": "Cluster Pillar Topic Title"
    }
  ],
  "categorizedTopics": [
    {
      "title": "Specific Topic Headline",
      "clusterName": "Cluster Name",
      "intent": "INFORMATIONAL",
      "depthLevel": 1,
      "parentTitle": null,
      "searchVolume": 4500,
      "cpcInr": 35.0
    }
  ]
}
`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: "You are an elite SEO topical map architect. You produce strictly valid JSON containing deep, actionable topical authority structures with zero generic fluff."
              },
              { role: "user", content: prompt }
            ],
            temperature: 0.25,
            max_tokens: 3500
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed.clusters) && Array.isArray(parsed.categorizedTopics) && parsed.categorizedTopics.length >= 10) {
              return {
                clusters: parsed.clusters,
                categorizedTopics: parsed.categorizedTopics,
                aiCostInr: 0.187 // Est cost per execution (~₹0.187)
              };
            }
          }
        } else {
          const errText = await res.text();
          console.warn("[AIRouter OpenAI Error]:", res.status, errText);
        }
      } catch (err) {
        console.warn("[AIRouter Exception] Triggering deterministic domain synthesizer fallback:", err);
      }
    }

    // High quality domain ontology generator fallback
    return this.generateDeterministicTaxonomy(cleanPrimary);
  }

  private generateDeterministicTaxonomy(topic: string): {
    clusters: GeneratedClusterOutput[];
    categorizedTopics: GeneratedTopicOutput[];
    aiCostInr: number;
  } {
    const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

    const clusters: GeneratedClusterOutput[] = [
      {
        name: `${formattedTopic} Fundamentals & Core Principles`,
        description: `Core concepts, baseline definitions, and foundational principles of ${topic}.`,
        pillarTopicTitle: `The Ultimate Guide to ${formattedTopic}: Foundations & Core Architecture`
      },
      {
        name: `${formattedTopic} Step-by-Step Implementation & Workflows`,
        description: `Actionable methodologies, frameworks, and practical execution guides for ${topic}.`,
        pillarTopicTitle: `${formattedTopic} Execution Playbook: Step-by-Step Workflows`
      },
      {
        name: `${formattedTopic} Tools, Technologies & Software Evaluation`,
        description: `Comparison matrices, software reviews, cost estimates, and tool selection criteria.`,
        pillarTopicTitle: `Best ${formattedTopic} Tools & Software Comparison Guide`
      },
      {
        name: `${formattedTopic} Auditing, Troubleshooting & Common Pitfalls`,
        description: `Diagnostic checklists, error prevention, and troubleshooting benchmarks for ${topic}.`,
        pillarTopicTitle: `${formattedTopic} Audit Checklist & Troubleshooting Guide`
      },
      {
        name: `Advanced ${formattedTopic} Optimization & Scalability`,
        description: `Enterprise-grade frameworks, advanced scaling tactics, and future trends in ${topic}.`,
        pillarTopicTitle: `Advanced ${formattedTopic} Strategies for High-Growth Teams`
      }
    ];

    const categorizedTopics: GeneratedTopicOutput[] = [];

    // Cluster 1
    const p1 = clusters[0].pillarTopicTitle;
    categorizedTopics.push({
      title: p1,
      clusterName: clusters[0].name,
      intent: 'INFORMATIONAL',
      depthLevel: 1,
      searchVolume: 5400,
      cpcInr: 25.0
    });
    categorizedTopics.push({
      title: `Key Concepts and Terminology in ${formattedTopic}`,
      clusterName: clusters[0].name,
      intent: 'INFORMATIONAL',
      depthLevel: 2,
      parentTitle: p1,
      searchVolume: 2100,
      cpcInr: 15.0
    });
    categorizedTopics.push({
      title: `Why ${formattedTopic} Matters for Modern Digital Growth`,
      clusterName: clusters[0].name,
      intent: 'INFORMATIONAL',
      depthLevel: 2,
      parentTitle: p1,
      searchVolume: 1800,
      cpcInr: 18.0
    });
    categorizedTopics.push({
      title: `Core Architectural Components of a ${formattedTopic} System`,
      clusterName: clusters[0].name,
      intent: 'INFORMATIONAL',
      depthLevel: 3,
      parentTitle: `Key Concepts and Terminology in ${formattedTopic}`,
      searchVolume: 950,
      cpcInr: 22.0
    });

    // Cluster 2
    const p2 = clusters[1].pillarTopicTitle;
    categorizedTopics.push({
      title: p2,
      clusterName: clusters[1].name,
      intent: 'COMMERCIAL',
      depthLevel: 1,
      searchVolume: 4200,
      cpcInr: 45.0
    });
    categorizedTopics.push({
      title: `How to Build a ${formattedTopic} Roadmap from Scratch`,
      clusterName: clusters[1].name,
      intent: 'INFORMATIONAL',
      depthLevel: 2,
      parentTitle: p2,
      searchVolume: 2600,
      cpcInr: 35.0
    });
    categorizedTopics.push({
      title: `Standard Operating Procedures for ${formattedTopic} Execution`,
      clusterName: clusters[1].name,
      intent: 'COMMERCIAL',
      depthLevel: 2,
      parentTitle: p2,
      searchVolume: 1400,
      cpcInr: 40.0
    });
    categorizedTopics.push({
      title: `Step-by-Step Phase Breakdown for ${formattedTopic} Rollout`,
      clusterName: clusters[1].name,
      intent: 'INFORMATIONAL',
      depthLevel: 3,
      parentTitle: `How to Build a ${formattedTopic} Roadmap from Scratch`,
      searchVolume: 800,
      cpcInr: 28.0
    });

    // Cluster 3
    const p3 = clusters[2].pillarTopicTitle;
    categorizedTopics.push({
      title: p3,
      clusterName: clusters[2].name,
      intent: 'COMMERCIAL',
      depthLevel: 1,
      searchVolume: 6100,
      cpcInr: 65.0
    });
    categorizedTopics.push({
      title: `Top 10 ${formattedTopic} Platforms Reviewed & Ranked`,
      clusterName: clusters[2].name,
      intent: 'COMMERCIAL',
      depthLevel: 2,
      parentTitle: p3,
      searchVolume: 3200,
      cpcInr: 75.0
    });
    categorizedTopics.push({
      title: `Budgeting and Pricing Breakdown for ${formattedTopic} Tools`,
      clusterName: clusters[2].name,
      intent: 'TRANSACTIONAL',
      depthLevel: 2,
      parentTitle: p3,
      searchVolume: 1900,
      cpcInr: 80.0
    });
    categorizedTopics.push({
      title: `Free vs Paid ${formattedTopic} Software: Feature Comparison`,
      clusterName: clusters[2].name,
      intent: 'COMMERCIAL',
      depthLevel: 3,
      parentTitle: `Top 10 ${formattedTopic} Platforms Reviewed & Ranked`,
      searchVolume: 1200,
      cpcInr: 50.0
    });

    // Cluster 4
    const p4 = clusters[3].pillarTopicTitle;
    categorizedTopics.push({
      title: p4,
      clusterName: clusters[3].name,
      intent: 'INFORMATIONAL',
      depthLevel: 1,
      searchVolume: 3800,
      cpcInr: 30.0
    });
    categorizedTopics.push({
      title: `7 Common ${formattedTopic} Mistakes and How to Prevent Them`,
      clusterName: clusters[3].name,
      intent: 'INFORMATIONAL',
      depthLevel: 2,
      parentTitle: p4,
      searchVolume: 2400,
      cpcInr: 25.0
    });
    categorizedTopics.push({
      title: `How to Conduct a Routine ${formattedTopic} Performance Audit`,
      clusterName: clusters[3].name,
      intent: 'COMMERCIAL',
      depthLevel: 2,
      parentTitle: p4,
      searchVolume: 1600,
      cpcInr: 45.0
    });
    categorizedTopics.push({
      title: `Diagnostic Metrics and KPIs for Measuring ${formattedTopic} Health`,
      clusterName: clusters[3].name,
      intent: 'INFORMATIONAL',
      depthLevel: 3,
      parentTitle: `How to Conduct a Routine ${formattedTopic} Performance Audit`,
      searchVolume: 900,
      cpcInr: 30.0
    });

    // Cluster 5
    const p5 = clusters[4].pillarTopicTitle;
    categorizedTopics.push({
      title: p5,
      clusterName: clusters[4].name,
      intent: 'INFORMATIONAL',
      depthLevel: 1,
      searchVolume: 2900,
      cpcInr: 50.0
    });
    categorizedTopics.push({
      title: `Scaling ${formattedTopic} Across Multi-Channel Environments`,
      clusterName: clusters[4].name,
      intent: 'INFORMATIONAL',
      depthLevel: 2,
      parentTitle: p5,
      searchVolume: 1500,
      cpcInr: 55.0
    });
    categorizedTopics.push({
      title: `Real-World Case Studies: How Top Teams Mastered ${formattedTopic}`,
      clusterName: clusters[4].name,
      intent: 'INFORMATIONAL',
      depthLevel: 2,
      parentTitle: p5,
      searchVolume: 1100,
      cpcInr: 40.0
    });

    return {
      clusters,
      categorizedTopics,
      aiCostInr: 0.00
    };
  }
}

