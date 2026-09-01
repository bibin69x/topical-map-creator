'use client';

import { EngineResult } from '@/lib/engine/types';
import { Compass, Printer, X } from 'lucide-react';
import { Button } from '../ui/button';

export function PdfReportView({
  result,
  onClose
}: {
  result: EngineResult;
  onClose: () => void;
}) {
  const handlePrint = () => {
    window.print();
  };

  const highPriorityTopics = result.topics.filter(t => t.priority === 'HIGH');
  const mediumPriorityTopics = result.topics.filter(t => t.priority === 'MEDIUM');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 overflow-y-auto p-4 sm:p-8 flex justify-center">
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded shadow-lg p-8 sm:p-10 space-y-6 print:p-0 print:shadow-none print:w-full print:max-w-none">
        {/* Print / Close Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
          <div className="text-xs font-bold font-mono uppercase text-slate-700">
            Executive Strategy Report Preview
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handlePrint} size="sm" className="space-x-1.5">
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Executive Header */}
        <div className="space-y-3 border-b-2 border-indigo-600 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold tracking-wider text-indigo-600 uppercase">Topical Authority Strategy Blueprint</p>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">{result.primaryTopic}</h1>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <p>Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
              <p>Quality Score: {result.qualityGateScore} / 100</p>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            A comprehensive, evidence-backed topical architecture designed to establish search authority, eliminate keyword cannibalization, and provide a content roadmap.
          </p>
        </div>

        {/* High Level Metrics */}
        <div className="grid grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <div>
            <span className="block text-2xl font-black text-slate-900">{result.topics.length}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Topics</span>
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-900">{result.clusters.length}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Topic Clusters</span>
          </div>
          <div>
            <span className="block text-2xl font-black text-indigo-600">{highPriorityTopics.length}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">High Priority</span>
          </div>
          <div>
            <span className="block text-2xl font-black text-emerald-600">{result.internalLinks.length}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Internal Links</span>
          </div>
        </div>

        {/* Topic Clusters Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">1. Core Pillar Clusters</h2>
          <div className="space-y-3">
            {result.clusters.map((cluster, i) => (
              <div key={cluster.id} className="border border-slate-200 rounded-md p-3.5 bg-slate-50/50">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-slate-900">
                    {i + 1}. {cluster.name}
                  </h3>
                  <span className="text-[11px] font-mono font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    Pillar: {cluster.pillarTopicTitle}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{cluster.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Creation Priority Roadmap */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">2. Immediate Content Roadmap (Phase 1: High Priority)</h2>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Topic Title</th>
                  <th className="p-2.5">Cluster</th>
                  <th className="p-2.5">Search Intent</th>
                  <th className="p-2.5 text-right">Priority Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {highPriorityTopics.map(topic => (
                  <tr key={topic.id}>
                    <td className="p-2.5 font-medium text-slate-900">{topic.title}</td>
                    <td className="p-2.5 text-slate-600">{topic.clusterName}</td>
                    <td className="p-2.5 font-mono text-[11px]">{topic.intent}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-indigo-600">{topic.priorityScore.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Internal Linking Directives */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">3. Strategic Internal-Linking Architecture</h2>
          <div className="space-y-2">
            {result.internalLinks.slice(0, 8).map((link, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="space-y-0.5">
                  <span className="font-medium text-slate-900">{link.sourceTopicTitle}</span>
                  <span className="text-slate-400 mx-2">→</span>
                  <span className="font-medium text-indigo-700">{link.targetTopicTitle}</span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded">{link.relationshipType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-6 flex justify-between items-center text-[11px] text-slate-500 font-mono">
          <span>Topical Authority Creator : Strategic Content Architecture</span>
          <span>Confidential Client Strategy Report</span>
        </div>
      </div>
    </div>
  );
}
