'use client';

import { useState } from 'react';
import { ProcessedTopic } from '@/lib/engine/types';
import { Search, Filter } from 'lucide-react';

export function TopicsTab({ topics }: { topics: ProcessedTopic[] }) {
  const [search, setSearch] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.clusterName.toLowerCase().includes(search.toLowerCase());
    const matchesIntent = selectedIntent === 'ALL' || t.intent === selectedIntent;
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesSearch && matchesIntent && matchesPriority;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search topics or clusters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
            <Filter className="h-3.5 w-3.5" />
            <span>Intent:</span>
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Intents</option>
              <option value="INFORMATIONAL">Informational</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="TRANSACTIONAL">Transactional</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
            <span>Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topics Data Table */}
      <div className="border border-slate-800 rounded-lg overflow-x-auto bg-slate-900">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider">
              <th className="py-3 px-4 font-medium">Topic Title</th>
              <th className="py-3 px-4 font-medium">Cluster</th>
              <th className="py-3 px-4 font-medium">Search Intent</th>
              <th className="py-3 px-4 font-medium">Priority</th>
              <th className="py-3 px-4 font-medium">Score</th>
              <th className="py-3 px-4 font-medium">Est. Vol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
            {filteredTopics.map((topic) => (
              <tr key={topic.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-medium text-slate-100">
                  {topic.title}
                  {topic.parentTitle && (
                    <span className="block text-[11px] text-slate-500 font-mono">↳ Parent: {topic.parentTitle}</span>
                  )}
                </td>
                <td className="py-3 px-4 text-indigo-300 font-medium">{topic.clusterName}</td>
                <td className="py-3 px-4 font-mono">
                  <span className={`inline-block px-2 py-0.5 rounded border text-[10px] ${
                    topic.intent === 'COMMERCIAL' ? 'bg-amber-950/60 border-amber-800 text-amber-300' :
                    topic.intent === 'TRANSACTIONAL' ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' :
                    'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {topic.intent}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">
                  <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${
                    topic.priority === 'HIGH' ? 'bg-rose-950/80 border-rose-800 text-rose-300' :
                    topic.priority === 'MEDIUM' ? 'bg-amber-950/80 border-amber-800 text-amber-300' :
                    'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {topic.priority}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-200">{topic.priorityScore}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{topic.searchVolume || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTopics.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No topics matched the selected search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
