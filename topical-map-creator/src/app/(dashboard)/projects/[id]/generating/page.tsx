'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GeneratingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const generationId = params.id;
  const [status, setStatus] = useState<string>('PROCESSING');
  const [error, setError] = useState<string | null>(null);

  const stages = [
    'RESEARCHING',
    'EXPANDING TOPICS',
    'CLUSTERING',
    'ANALYZING INTENT',
    'PRIORITIZING',
    'BUILDING MAP'
  ];

  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    // Stage transition animation timer
    const stageInterval = setInterval(() => {
      setCurrentStageIdx(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 800);

    // Poll status from backend
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/generations/${generationId}/status`);
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.status === 'COMPLETED') {
            clearInterval(pollInterval);
            clearInterval(stageInterval);
            setCurrentStageIdx(stages.length - 1);
            setTimeout(() => {
              router.push(`/projects/${generationId}`);
            }, 600);
          } else if (json.data.status === 'FAILED') {
            clearInterval(pollInterval);
            clearInterval(stageInterval);
            setStatus('FAILED');
            setError(json.data.error || 'Pipeline execution failed.');
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 800);

    return () => {
      clearInterval(stageInterval);
      clearInterval(pollInterval);
    };
  }, [generationId, router]);

  return (
    <div className="max-w-md mx-auto py-12 text-center space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded p-6 space-y-5">
        {status === 'FAILED' ? (
          <>
            <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
            <h2 className="text-sm font-bold text-rose-300">Generation Failed</h2>
            <p className="text-xs text-slate-400">{error}</p>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wide">Building Topical Authority Map</h2>
              <p className="text-xs text-slate-400 mt-1">Executing 16-stage taxonomy engine pipeline...</p>
            </div>

            <div className="space-y-1.5 text-left pt-1 font-mono text-xs">
              {stages.map((stage, idx) => {
                const isCurrent = idx === currentStageIdx;
                const isPast = idx < currentStageIdx;
                return (
                  <div key={stage} className={`flex items-center space-x-2.5 p-2 rounded text-[11px] ${
                    isCurrent ? 'bg-slate-950 border border-slate-700 text-white' :
                    isPast ? 'text-emerald-400' : 'text-slate-600'
                  }`}>
                    {isPast ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 text-slate-300 animate-spin shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-sm border border-slate-800 shrink-0" />
                    )}
                    <span>{stage}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

