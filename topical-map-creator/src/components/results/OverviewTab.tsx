import { EngineResult } from '@/lib/engine/types';

export function OverviewTab({ result }: { result: EngineResult }) {
  const highPriorityCount = result.topics.filter(t => t.priority === 'HIGH').length;

  return (
    <div className="space-y-5">
      {/* Metric Cards - Clean Data Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">Total Topics</span>
          <p className="mt-1 text-2xl font-bold text-white font-mono">{result.topics.length}</p>
          <span className="text-[11px] text-slate-500">Structured SEO entities</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">Content Clusters</span>
          <p className="mt-1 text-2xl font-bold text-white font-mono">{result.clusters.length}</p>
          <span className="text-[11px] text-slate-500">Semantic cluster pillars</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">High Priority</span>
          <p className="mt-1 text-2xl font-bold text-amber-400 font-mono">{highPriorityCount}</p>
          <span className="text-[11px] text-slate-500">Immediate phase-1 pages</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded p-4">
          <span className="text-[11px] font-mono uppercase text-slate-400">Quality Gate</span>
          <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono">{result.qualityGateScore}/100</p>
          <span className="text-[11px] text-emerald-500 font-mono">VALIDATION PASS</span>
        </div>
      </div>

      {/* Cluster Overview List */}
      <div className="bg-slate-900 border border-slate-800 rounded p-5">
        <h3 className="text-sm font-semibold text-white mb-3">
          Topical Architecture Breakdown
        </h3>
        <div className="space-y-3">
          {result.clusters.map((cluster, i) => (
            <div key={i} className="border border-slate-800 bg-slate-950 rounded p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-semibold text-white">{cluster.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{cluster.description}</p>
                <div className="mt-1.5 flex items-center space-x-2 text-[11px] font-mono text-slate-500">
                  <span>Pillar Topic: <strong className="text-slate-300">{cluster.pillarTopicTitle}</strong></span>
                </div>
              </div>
              <div className="shrink-0 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-xs font-mono text-slate-300">
                {cluster.topicCount} Topics
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

