import { EngineResult } from '@/lib/engine/types';
import { Layers, FileText, Target, ShieldCheck, TrendingUp } from 'lucide-react';

export function OverviewTab({ result }: { result: EngineResult }) {
  const highPriorityCount = result.topics.filter(t => t.priority === 'HIGH').length;
  const informationalCount = result.topics.filter(t => t.intent === 'INFORMATIONAL').length;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Total Topics</span>
            <FileText className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-100">{result.topics.length}</p>
          <span className="mt-1 text-xs text-slate-500">Structured SEO topics</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Topical Clusters</span>
            <Layers className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-100">{result.clusters.length}</p>
          <span className="mt-1 text-xs text-slate-500">Semantic cluster groups</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">High Priority</span>
            <TrendingUp className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-400">{highPriorityCount}</p>
          <span className="mt-1 text-xs text-slate-500">Immediate target pages</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Quality Gate</span>
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{result.qualityGateScore}/100</p>
          <span className="mt-1 text-xs text-emerald-500 font-mono">PASSED VALIDATION</span>
        </div>
      </div>

      {/* Cluster Overview List */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-indigo-400" />
          <span>Topical Architecture Breakdown</span>
        </h3>
        <div className="space-y-4">
          {result.clusters.map((cluster, i) => (
            <div key={i} className="border border-slate-800 bg-slate-950/60 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-indigo-300">{cluster.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{cluster.description}</p>
                <div className="mt-2 flex items-center space-x-3 text-xs font-mono text-slate-500">
                  <span>Pillar: <strong className="text-slate-300">{cluster.pillarTopicTitle}</strong></span>
                </div>
              </div>
              <div className="shrink-0 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-xs font-mono text-slate-300">
                {cluster.topicCount} Topics
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
