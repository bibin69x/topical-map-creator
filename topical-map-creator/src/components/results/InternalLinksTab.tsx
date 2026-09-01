import { InternalLinkSuggestion } from '@/lib/engine/types';
import { ArrowRight } from 'lucide-react';

export function InternalLinksTab({ links }: { links: InternalLinkSuggestion[] }) {
  return (
    <div className="space-y-3">
      <div className="bg-slate-900 border border-slate-800 rounded p-4">
        <h3 className="text-xs font-semibold text-white">
          Internal Linking Architecture Directives
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Contextual internal linking recommendations between child topics and pillar pages.
        </p>
      </div>

      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-300 w-full md:w-auto">
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-medium text-white">
                {link.sourceTopicTitle}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-medium text-slate-200">
                {link.targetTopicTitle}
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="bg-slate-950 border border-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded text-[10px]">
                {link.relationshipType}
              </span>
              <span className="text-slate-400">Anchor: &ldquo;{link.anchorTextSuggestion}&rdquo;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

