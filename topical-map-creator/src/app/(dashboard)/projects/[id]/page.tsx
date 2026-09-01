'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EngineResult } from '@/lib/engine/types';
import { OverviewTab } from '@/components/results/OverviewTab';
import { TopicsTab } from '@/components/results/TopicsTab';
import { ClustersTab } from '@/components/results/ClustersTab';
import { IntentTab } from '@/components/results/IntentTab';
import { InternalLinksTab } from '@/components/results/InternalLinksTab';
import { ExportTab } from '@/components/results/ExportTab';
import { FeedbackWidget } from '@/components/results/FeedbackWidget';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/button';

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
        <p className="text-xs text-slate-400 font-mono">Loading Topical Authority Map Results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded p-8 space-y-4">
          <h2 className="text-base font-bold text-white">Topical Map Not Found</h2>
          <p className="text-xs text-slate-400">
            This generation session could not be located or may have expired.
          </p>
          <div className="pt-2">
            <Link href="/create">
              <Button size="sm">Create New Topical Map</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayResult = result;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'topics', label: 'Topics Table' },
    { id: 'clusters', label: 'Content Clusters' },
    { id: 'intent', label: 'Search Intent' },
    { id: 'links', label: 'Internal Links' },
    { id: 'export', label: 'Export Data' },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Topical Authority Strategy
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{displayResult.primaryTopic}</h1>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded self-start">
          <span>{displayResult.topics.length} Topics</span>
          <span>•</span>
          <span>{displayResult.clusters.length} Clusters</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">Score: {displayResult.qualityGateScore}/100</span>
        </div>
      </div>

      {/* 6-Tab Primary Navigation */}
      <div className="border-b border-slate-800 overflow-x-auto">
        <nav className="flex space-x-1 min-w-max pb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "px-3.5 py-2 text-xs font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-slate-100 text-white font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                )}
              >
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

