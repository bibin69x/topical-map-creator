import { InternalLinkSuggestion } from '@/lib/engine/types';
import { GitCommit, ArrowRight } from 'lucide-react';

export function InternalLinksTab({ links }: { links: InternalLinkSuggestion[] }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <GitCommit className="h-4 w-4 text-indigo-400" />
          <span>Internal Linking Graph Architecture</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Recommended context links between supporting topics and pillar pages to distribute topical authority.
        </p>
      </div>

      <div className="space-y-3">
        {links.map((link, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-300 w-full md:w-auto">
              <span className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-indigo-300 font-sans font-medium">
                {link.sourceTopicTitle}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
              <span className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 text-emerald-300 font-sans font-medium">
                {link.targetTopicTitle}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="bg-indigo-950/80 border border-indigo-800 text-indigo-300 font-mono px-2 py-0.5 rounded text-[10px]">
                {link.relationshipType}
              </span>
              <span className="text-slate-400 italic">"{link.anchorTextSuggestion}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
