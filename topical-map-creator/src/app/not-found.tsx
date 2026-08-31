import Link from 'next/link';
import { Compass, FileQuestion, ArrowRight, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
        <div className="mx-auto w-12 h-12 rounded-full bg-indigo-950/80 border border-indigo-800 flex items-center justify-center">
          <FileQuestion className="h-6 w-6 text-indigo-400" />
        </div>

        <div className="space-y-2">
          <div className="inline-block bg-slate-950 text-indigo-400 border border-slate-800 px-2.5 py-0.5 rounded text-xs font-mono">
            404 NOT FOUND
          </div>
          <h2 className="text-xl font-bold text-slate-100">Topical Map Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page or project you requested does not exist, has been removed, or is no longer accessible.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/projects" className="w-full sm:w-auto">
            <Button className="w-full space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white">
              <Folder className="h-4 w-4" />
              <span>My Projects</span>
            </Button>
          </Link>

          <Link href="/create" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full space-x-2 text-slate-300 border-slate-800">
              <span>New Map</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
