import Link from 'next/link';
import { Compass, CheckCircle2, ArrowRight, Shield, Database, FileSpreadsheet, GitGraph } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-lg">
            <Compass className="h-6 w-6" />
            <span className="text-slate-100 font-semibold">Topical Authority Creator</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/create">
              <Button size="sm">Create Free Map</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 bg-indigo-950/80 border border-indigo-800 px-3 py-1 rounded-full text-xs font-mono text-indigo-300">
          <span>₹199 Early Access • 10 Topical Authority Projects</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Build Topical Authority Without Expensive SEO Software
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Generate structured topic clusters, search intent, data-backed priority scores, and internal-linking relationships in minutes.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/create">
            <Button size="lg" className="w-full sm:w-auto space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white">
              <span>Create My Topical Map</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 bg-slate-900/50 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
            <Database className="h-6 w-6 text-indigo-400 mb-3" />
            <h3 className="text-base font-semibold text-slate-200">SEO Logic + Evidence</h3>
            <p className="text-xs text-slate-400 mt-2">
              Built on search evidence and deterministic scoring formulas rather than generic LLM guesses.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
            <GitGraph className="h-6 w-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-semibold text-slate-200">Internal Linking Graph</h3>
            <p className="text-xs text-slate-400 mt-2">
              Turns keyword lists into actionable site architecture plans with parent-child and pillar links.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
            <FileSpreadsheet className="h-6 w-6 text-amber-400 mb-3" />
            <h3 className="text-base font-semibold text-slate-200">CSV & PDF Exports</h3>
            <p className="text-xs text-slate-400 mt-2">
              Export complete topical maps into spreadsheets ready to hand off to content teams or clients.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Topical Authority Creator MVP © 2026. Built with Next.js, Supabase, & DataForSEO.
      </footer>
    </div>
  );
}
