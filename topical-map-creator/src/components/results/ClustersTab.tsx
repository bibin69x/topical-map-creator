import { TopicCluster, ProcessedTopic } from '@/lib/engine/types';

export function ClustersTab({ clusters, topics }: { clusters: TopicCluster[]; topics: ProcessedTopic[] }) {
  return (
    <div className="space-y-4">
      {clusters.map((cluster) => {
        const clusterTopics = topics.filter(t => t.clusterName === cluster.name);
        return (
          <div key={cluster.id} className="bg-slate-900 border border-slate-800 rounded p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <h3 className="text-sm font-semibold text-white">{cluster.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{cluster.description}</p>
              </div>
              <div className="font-mono text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 self-start">
                Pillar: <strong className="text-white">{cluster.pillarTopicTitle}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {clusterTopics.map(t => (
                <div key={t.id} className="bg-slate-950 border border-slate-800 rounded p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-100">{t.title}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                      t.priority === 'HIGH' ? 'bg-rose-950 border-rose-800 text-rose-300' :
                      'bg-slate-900 border-slate-700 text-slate-400'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Intent: {t.intent}</span>
                    <span>Score: {t.priorityScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

