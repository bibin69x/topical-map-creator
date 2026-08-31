'use client';

import Link from 'next/link';
import { Compass, Zap, Folder, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar({ creditsRemaining = 1, isPaid = false }: { creditsRemaining?: number; isPaid?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <Link href="/projects" className="flex items-center space-x-2 text-indigo-400 font-bold text-lg tracking-tight">
            <Compass className="h-6 w-6" />
            <span className="text-slate-100 font-semibold">Topical Authority <span className="text-indigo-400 font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800">MVP</span></span>
          </Link>
          <nav className="hidden md:flex space-x-4 text-sm font-medium text-slate-300">
            <Link href="/projects" className="flex items-center space-x-1.5 hover:text-white transition-colors py-1 px-2 rounded">
              <Folder className="h-4 w-4 text-slate-400" />
              <span>Projects</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono">
            <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-slate-300">Credits: <strong className="text-white">{creditsRemaining}</strong></span>
            {!isPaid && (
              <span className="text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 border border-emerald-800 rounded text-[10px]">FREE</span>
            )}
          </div>

          <Link href="/create">
            <Button size="sm" className="space-x-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>New Map</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
