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

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-4">
          <Compass className="h-10 w-10 text-slate-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-100">Topical Map Not Found</h2>
          <p className="text-xs text-slate-400">
            This generation session could not be located or may have expired.
          </p>
          <div className="pt-2">
            <a
              href="/create"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-md transition-colors"
            >
              <span>Create New Topical Map</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const displayResult = result;

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
