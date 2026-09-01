'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      localStorage.setItem('tac_user', JSON.stringify(data.user));
      router.push('/create');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-left space-y-1">
        <Link href="/" className="font-bold text-base tracking-tight text-white uppercase font-mono">
          Topical Authority Creator
        </Link>
        <h2 className="text-xl font-bold text-white">Create Free Account</h2>
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-slate-200 hover:text-white underline font-medium">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-6 px-6 rounded space-y-4">
          <div className="bg-slate-950 border border-slate-700 p-2.5 rounded text-xs text-slate-300 flex items-center justify-between">
            <span>Free Evaluation Credit:</span>
            <strong className="text-emerald-400 font-mono">1 Topical Map</strong>
          </div>

          {error && (
            <div className="bg-rose-950 border border-rose-800 text-rose-200 text-xs p-2.5 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
              />
            </div>

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
              <label className="block text-xs font-semibold text-slate-200 mb-1">Password (min 8 characters)</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-slate-400 hover:text-slate-200 underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-slate-400 hover:text-slate-200 underline">Privacy Policy</Link>.
            </p>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full justify-center"
              >
                {loading ? 'Creating Account...' : 'Create Account & Get Free Map'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

