'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sign in');
      }

      // Save demo session marker in localStorage
      localStorage.setItem('tac_user', JSON.stringify(data.user));
      router.push('/projects');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    const demoUser = {
      id: 'demo-seo-user',
      email: 'specialist@agency.in',
      fullName: 'SEO Practitioner'
    };
    localStorage.setItem('tac_user', JSON.stringify(demoUser));
    router.push('/projects');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-left space-y-1">
        <Link href="/" className="font-bold text-base tracking-tight text-white uppercase font-mono">
          Topical Authority Creator
        </Link>
        <h2 className="text-xl font-bold text-white">Sign In</h2>
        <p className="text-xs text-slate-400">
          Or{' '}
          <Link href="/signup" className="text-slate-200 hover:text-white underline font-medium">
            create a new account for 1 free topical map
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-6 px-6 rounded space-y-4">
          {error && (
            <div className="bg-rose-950 border border-rose-800 text-rose-200 text-xs p-2.5 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Email address</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full justify-center"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-slate-900 px-2 text-slate-500 font-mono">OR</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemoSignIn}
            className="w-full justify-center text-xs"
          >
            <span>Instant Demo Access (No Password)</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

