'use client';

import { useEffect, useState } from 'react';
import { EngineResult } from '@/lib/engine/types';
import { OverviewTab } from '@/components/results/OverviewTab';
import { TopicsTab } from '@/components/results/TopicsTab';
import { ClustersTab } from '@/components/results/ClustersTab';
import { IntentTab } from '@/components/results/IntentTab';
import { InternalLinksTab } from '@/components/results/InternalLinksTab';
import { ExportTab } from '@/components/results/ExportTab';
import { FeedbackWidget } from '@/components/results/FeedbackWidget';
import { Compass, LayoutDashboard, FileText, Layers, Target, GitCommit, Download, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function ResultsDashboardPage({ params }: { params: { id: string } }) {
  const generationId = params.id;
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'clusters' | 'intent' | 'links' | 'export'>('overview');
  const [result, setResult] = useState<EngineResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/generations/${generationId}/status`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.result) {
          setResult(json.data.result);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [generationId]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
        <p className="text-xs text-slate-400 font-mono">Loading Topical Authority Map Results...</p>
      </div>
    );
  }

  // Fallback demo result if accessed directly or refreshed
  const displayResult: EngineResult = result || {
    projectId: 'demo-proj',
    primaryTopic: 'Technical SEO Strategy',
    clusters: [
      { id: 'c-1', name: 'Technical SEO Core & Strategy', description: 'Fundamental site architecture, crawlability, and indexing guidelines.', pillarTopicTitle: 'Technical SEO Audit', topicCount: 5 },
      { id: 'c-2', name: 'Crawlability & Indexing Optimization', description: 'Robots.txt, XML sitemaps, canonical tags, and HTTP status codes.', pillarTopicTitle: 'Crawlability Optimization', topicCount: 5 },
      { id: 'c-3', name: 'Page Speed & Core Web Vitals', description: 'LCP, CLS, INP optimization and performance budgets.', pillarTopicTitle: 'Core Web Vitals Guide', topicCount: 5 },
    ],
    topics: [
      { id: 't-1', title: 'Technical SEO Audit Checklist', slug: 'technical-seo-audit-checklist', clusterName: 'Technical SEO Core & Strategy', intent: 'COMMERCIAL', priority: 'HIGH', priorityScore: 92.5, depthLevel: 1, searchVolume: 2400, cpcInr: 45, confidenceScore: 90 },
      { id: 't-2', title: 'How to Fix Indexing Issues in Google Search Console', slug: 'fix-indexing-issues-gsc', clusterName: 'Crawlability & Indexing Optimization', intent: 'INFORMATIONAL', priority: 'HIGH', priorityScore: 88.0, parentTitle: 'Technical SEO Audit Checklist', depthLevel: 2, searchVolume: 1800, cpcInr: 25, confidenceScore: 90 },
      { id: 't-3', title: 'Robots.txt Best Practices & Directives', slug: 'robots-txt-best-practices', clusterName: 'Crawlability & Indexing Optimization', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 65.0, parentTitle: 'Technical SEO Audit Checklist', depthLevel: 2, searchVolume: 1200, cpcInr: 15, confidenceScore: 85 },
      { id: 't-4', title: 'Core Web Vitals Optimization Guide 2026', slug: 'core-web-vitals-optimization-guide', clusterName: 'Page Speed & Core Web Vitals', intent: 'COMMERCIAL', priority: 'HIGH', priorityScore: 85.0, depthLevel: 1, searchVolume: 1900, cpcInr: 35, confidenceScore: 90 },
      { id: 't-5', title: 'Canonical Tag Implementation Mistakes', slug: 'canonical-tag-mistakes', clusterName: 'Crawlability & Indexing Optimization', intent: 'INFORMATIONAL', priority: 'MEDIUM', priorityScore: 58.0, parentTitle: 'Robots.txt Best Practices & Directives', depthLevel: 3, searchVolume: 800, cpcInr: 12, confidenceScore: 80 },
    ],
    internalLinks: [
      { sourceTopicTitle: 'How to Fix Indexing Issues in Google Search Console', targetTopicTitle: 'Technical SEO Audit Checklist', relationshipType: 'PARENT_CHILD', anchorTextSuggestion: 'Learn more in our Technical SEO Audit' },
      { sourceTopicTitle: 'Robots.txt Best Practices & Directives', targetTopicTitle: 'Technical SEO Audit Checklist', relationshipType: 'PARENT_CHILD', anchorTextSuggestion: 'Complete Technical SEO Audit' },
    ],
    qualityPassed: true,
    qualityGateScore: 95,
    totalSearchCostInr: 3.20,
    totalAiCostInr: 0.187
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'topics', label: 'Topics', icon: FileText },
    { id: 'clusters', label: 'Clusters', icon: Layers },
    { id: 'intent', label: 'Intent', icon: Target },
    { id: 'links', label: 'Internal Links', icon: GitCommit },
    { id: 'export', label: 'Export', icon: Download },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-1">
            <Compass className="h-4 w-4" />
            <span>TOPICAL AUTHORITY MAP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">{displayResult.primaryTopic}</h1>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md self-start">
          <span>{displayResult.topics.length} Topics</span>
          <span>•</span>
          <span>{displayResult.clusters.length} Clusters</span>
          <span>•</span>
          <span className="text-emerald-400">Score: {displayResult.qualityGateScore}</span>
        </div>
      </div>

      {/* 6-Tab Primary Navigation */}
      <div className="border-b border-slate-800 overflow-x-auto">
        <nav className="flex space-x-2 min-w-max pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "flex items-center space-x-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-indigo-500 text-indigo-400 bg-indigo-950/30"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'overview' && <OverviewTab result={displayResult} />}
        {activeTab === 'topics' && <TopicsTab topics={displayResult.topics} />}
        {activeTab === 'clusters' && <ClustersTab clusters={displayResult.clusters} topics={displayResult.topics} />}
        {activeTab === 'intent' && <IntentTab topics={displayResult.topics} />}
        {activeTab === 'links' && <InternalLinksTab links={displayResult.internalLinks} />}
        {activeTab === 'export' && <ExportTab result={displayResult} isPaid={false} />}
      </div>

      {/* Beta Feedback Loop */}
      <FeedbackWidget generationId={generationId} />
    </div>
  );
}
