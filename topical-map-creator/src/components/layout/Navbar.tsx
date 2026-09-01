'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LogIn } from 'lucide-react';
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
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-6">
          <Link href="/projects" className="flex items-center space-x-2 font-bold text-sm tracking-tight text-white uppercase font-mono">
            <span>Topical Authority</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
              MVP
            </span>
          </Link>
          <nav className="hidden md:flex space-x-4 text-xs font-medium text-slate-300">
            <Link href="/projects" className="hover:text-white transition-colors py-1 px-2 rounded">
              Projects
            </Link>
            <Link href="/settings" className="text-slate-400 hover:text-white transition-colors py-1 px-2 rounded">
              Settings
            </Link>
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors py-1 px-2 rounded">
              Admin
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-xs font-mono">
            <span className="text-slate-400">Credits: <strong className="text-white">{creditsRemaining}</strong></span>
            {!isPaid && (
              <span className="text-slate-400 bg-slate-800 px-1 py-0.2 border border-slate-700 rounded text-[9px] font-bold">
                FREE
              </span>
            )}
          </div>

          <Link href="/create">
            <Button size="sm">
              <span>New Map</span>
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
              <span className="text-xs text-slate-300 font-mono hidden md:inline truncate max-w-[120px]">
                {user.fullName || user.email.split('@')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 px-2"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
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

