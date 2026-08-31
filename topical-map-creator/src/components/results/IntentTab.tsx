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
    { type: 'INFORMATIONAL', count: counts.INFORMATIONAL, color: 'bg-indigo-500', pct: Math.round((counts.INFORMATIONAL / total) * 100), desc: 'Top-of-funnel educational and guide content.' },
    { type: 'COMMERCIAL', count: counts.COMMERCIAL, color: 'bg-amber-500', pct: Math.round((counts.COMMERCIAL / total) * 100), desc: 'Comparison, tools, and solution evaluation content.' },
    { type: 'TRANSACTIONAL', count: counts.TRANSACTIONAL, color: 'bg-emerald-500', pct: Math.round((counts.TRANSACTIONAL / total) * 100), desc: 'High-intent implementation, pricing, and purchase content.' },
    { type: 'NAVIGATIONAL', count: counts.NAVIGATIONAL, color: 'bg-slate-500', pct: Math.round((counts.NAVIGATIONAL / total) * 100), desc: 'Brand and specific tool access queries.' },
  ];

  return (
    <div className="space-y-6">
      {/* Distribution Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Search Intent Funnel Distribution</h3>
        <p className="text-xs text-slate-400 mb-4">Proportion of topics targeted across the search intent spectrum.</p>

        <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex">
          {intents.map(item => (
            <div key={item.type} style={{ width: `${item.pct}%` }} className={`${item.color} h-full transition-all`} title={`${item.type}: ${item.pct}%`} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          {intents.map(item => (
            <div key={item.type} className="flex items-center space-x-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              <span className="text-slate-300">{item.type}: <strong className="text-white">{item.pct}%</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {intents.map(item => (
          <div key={item.type} className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-200">{item.type}</h4>
              <span className="font-mono text-xs text-indigo-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">{item.count} Topics</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
