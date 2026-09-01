'use client';

import { useState } from 'react';
import { ProcessedTopic } from '@/lib/engine/types';
import { Search } from 'lucide-react';

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
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter topics or clusters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
            <span>Intent:</span>
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
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
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-500"
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
      <div className="border border-slate-800 rounded overflow-x-auto bg-slate-900">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3.5 font-medium font-sans">Topic Title</th>
              <th className="py-2.5 px-3.5 font-medium font-sans">Cluster</th>
              <th className="py-2.5 px-3.5 font-medium">Intent</th>
              <th className="py-2.5 px-3.5 font-medium">Priority</th>
              <th className="py-2.5 px-3.5 font-medium">Score</th>
              <th className="py-2.5 px-3.5 font-medium">Est. Vol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {filteredTopics.map((topic) => (
              <tr key={topic.id} className="hover:bg-slate-800/50">
                <td className="py-2.5 px-3.5 font-sans font-medium text-white">
                  {topic.title}
                  {topic.parentTitle && (
                    <span className="block text-[11px] text-slate-500 font-mono">↳ Parent: {topic.parentTitle}</span>
                  )}
                </td>
                <td className="py-2.5 px-3.5 text-slate-300 font-sans">{topic.clusterName}</td>
                <td className="py-2.5 px-3.5">
                  <span className={`inline-block px-1.5 py-0.5 rounded border text-[10px] ${
                    topic.intent === 'COMMERCIAL' ? 'bg-amber-950 border-amber-800 text-amber-300' :
                    topic.intent === 'TRANSACTIONAL' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' :
                    'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {topic.intent}
                  </span>
                </td>
                <td className="py-2.5 px-3.5">
                  <span className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                    topic.priority === 'HIGH' ? 'bg-rose-950 border-rose-800 text-rose-300' :
                    topic.priority === 'MEDIUM' ? 'bg-amber-950 border-amber-800 text-amber-300' :
                    'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    {topic.priority}
                  </span>
                </td>
                <td className="py-2.5 px-3.5 font-bold text-white">{topic.priorityScore}</td>
                <td className="py-2.5 px-3.5 text-slate-400">{topic.searchVolume || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTopics.length === 0 && (
          <div className="p-6 text-center text-slate-500 text-xs font-mono">
            No topics match the selected search or filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}

