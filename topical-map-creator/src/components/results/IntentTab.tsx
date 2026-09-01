import { ProcessedTopic } from '@/lib/engine/types';

export function IntentTab({ topics }: { topics: ProcessedTopic[] }) {
  const counts = {
    INFORMATIONAL: topics.filter(t => t.intent === 'INFORMATIONAL').length,
    COMMERCIAL: topics.filter(t => t.intent === 'COMMERCIAL').length,
    TRANSACTIONAL: topics.filter(t => t.intent === 'TRANSACTIONAL').length,
    NAVIGATIONAL: topics.filter(t => t.intent === 'NAVIGATIONAL').length,
  };

  const total = topics.length || 1;

  const intents = [
    { type: 'INFORMATIONAL', count: counts.INFORMATIONAL, color: 'bg-blue-500', pct: Math.round((counts.INFORMATIONAL / total) * 100), desc: 'Top-of-funnel educational and guide content.' },
    { type: 'COMMERCIAL', count: counts.COMMERCIAL, color: 'bg-amber-500', pct: Math.round((counts.COMMERCIAL / total) * 100), desc: 'Comparison, tools, and solution evaluation content.' },
    { type: 'TRANSACTIONAL', count: counts.TRANSACTIONAL, color: 'bg-emerald-500', pct: Math.round((counts.TRANSACTIONAL / total) * 100), desc: 'High-intent implementation, pricing, and purchase content.' },
    { type: 'NAVIGATIONAL', count: counts.NAVIGATIONAL, color: 'bg-slate-500', pct: Math.round((counts.NAVIGATIONAL / total) * 100), desc: 'Brand and specific tool access queries.' },
  ];

  return (
    <div className="space-y-4">
      {/* Distribution Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h3 className="text-xs font-semibold text-white mb-1">Search Intent Distribution</h3>
        <p className="text-xs text-slate-400 mb-3">Proportion of topics targeted across the search intent spectrum.</p>

        <div className="h-3 w-full bg-slate-950 rounded overflow-hidden flex">
          {intents.map(item => (
            <div key={item.type} style={{ width: `${item.pct}%` }} className={`${item.color} h-full`} title={`${item.type}: ${item.pct}%`} />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          {intents.map(item => (
            <div key={item.type} className="flex items-center space-x-1.5">
              <span className={`h-2 w-2 rounded-sm ${item.color}`} />
              <span className="text-slate-300">{item.type}: <strong className="text-white">{item.pct}%</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {intents.map(item => (
          <div key={item.type} className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-white">{item.type}</h4>
              <span className="font-mono text-xs text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{item.count} Topics</span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

