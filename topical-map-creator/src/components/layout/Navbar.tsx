'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Zap, Folder, PlusCircle, LogOut, LogIn, User, Shield } from 'lucide-react';
import { Button } from '../ui/button';

interface TacUser {
  id: string;
  email: string;
  fullName?: string;
}

export function Navbar({ creditsRemaining = 1, isPaid = false }: { creditsRemaining?: number; isPaid?: boolean }) {
  const router = useRouter();
  const [user, setUser] = useState<TacUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tac_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignored in SSR
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Best effort
    }
    localStorage.removeItem('tac_user');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <Link href="/projects" className="flex items-center space-x-2 text-indigo-400 font-bold text-lg tracking-tight">
            <Compass className="h-6 w-6" />
            <span className="text-slate-100 font-semibold">
              Topical Authority{' '}
              <span className="text-indigo-400 font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                MVP
              </span>
            </span>
          </Link>
          <nav className="hidden md:flex space-x-4 text-sm font-medium text-slate-300">
            <Link href="/projects" className="flex items-center space-x-1.5 hover:text-white transition-colors py-1 px-2 rounded">
              <Folder className="h-4 w-4 text-slate-400" />
              <span>Projects</span>
            </Link>
            <Link href="/admin" className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 transition-colors py-1 px-2 rounded">
              <Shield className="h-3.5 w-3.5" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-full text-xs font-mono">
            <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-slate-300">Credits: <strong className="text-white">{creditsRemaining}</strong></span>
            {!isPaid && (
              <span className="text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 border border-emerald-800 rounded text-[10px]">
                FREE
              </span>
            )}
          </div>

          <Link href="/create">
            <Button size="sm" className="space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">New Map</span>
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
              <span className="text-xs text-slate-300 font-medium hidden md:inline truncate max-w-[120px]">
                {user.fullName || user.email.split('@')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 px-2"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white space-x-1">
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
