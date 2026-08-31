'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to console / telemetry
    console.error('[Application Error Boundary caught error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-rose-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100">Something Went Wrong</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected error occurred during this operation. Your projects and credits are safe.
          </p>
          {error.digest && (
            <div className="inline-block bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-500 mt-2">
              Error Digest: {error.digest}
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/projects" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full space-x-2 text-slate-300 border-slate-800">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
