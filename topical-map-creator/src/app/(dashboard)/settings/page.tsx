'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Shield, User, Zap, AlertTriangle, Trash2, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TacUser {
  id: string;
  email: string;
  fullName?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<TacUser | null>(null);
  const [credits, setCredits] = useState<number>(1);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('tac_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
      const storedCredits = localStorage.getItem('tac_credits');
      if (storedCredits) {
        setCredits(parseInt(storedCredits, 10));
      }
      const storedPaid = localStorage.getItem('tac_is_paid');
      if (storedPaid === 'true') {
        setIsPaid(true);
      }
    } catch {
      // Ignored
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (deleteInput !== 'DELETE') {
      setError('Please type DELETE exactly to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const userId = user?.id || 'mock-current-user';
      const res = await fetch(`/api/user/account?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete account.');
      }

      setDeletionSuccess(true);
      localStorage.removeItem('tac_user');
      localStorage.removeItem('tac_credits');
      localStorage.removeItem('tac_is_paid');

      setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during account deletion.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-1">
          <Settings className="h-4 w-4" />
          <span>ACCOUNT & SYSTEM PREFERENCES</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your plan entitlements, generation credits, privacy preferences, and account deletion.
        </p>
      </div>

      {deletionSuccess ? (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-6 rounded-lg space-y-3 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-100">Account Successfully Deleted</h2>
          <p className="text-xs text-slate-300">
            All your projects, topical maps, and personal data have been permanently purged. Redirecting you to the home page...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan & Entitlements Section */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-indigo-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Plan & Generation Entitlements</h2>
                  <p className="text-xs text-slate-400">
                    {isPaid ? '₹199 Early Access (10 Generations Plan)' : 'Free Evaluation Plan (1 Initial Generation)'}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border ${
                isPaid 
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-800' 
                  : 'bg-amber-950/80 text-amber-300 border-amber-800'
              }`}>
                {isPaid ? 'PRO ACTIVE' : 'FREE TIER'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="bg-slate-950/60 p-4 rounded-md border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Available Credits</span>
                <span className="text-2xl font-bold font-mono text-slate-100">{credits}</span>
                <span className="text-xs text-slate-500 block mt-1">
                  1 credit = 1 complete 16-stage topical authority map
                </span>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-md border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Early Access Upgrade</span>
                  <span className="text-xs text-slate-300">
                    Unlock 10 complete topical maps + full CSV & printable PDF exports for ₹199.
                  </span>
                </div>
                <Link href="/projects" className="mt-3">
                  <Button size="sm" variant="outline" className="w-full text-xs space-x-1 border-indigo-800 text-indigo-300 hover:bg-indigo-950/50">
                    <span>Manage Upgrades</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* User Profile Details */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-100">User Profile</h2>
                <p className="text-xs text-slate-400">Authenticated account credentials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Email Address:</span>
                <span className="text-slate-200 font-mono">{user?.email || 'demo.user@agency.in'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Account ID:</span>
                <span className="text-slate-200 font-mono truncate block">{user?.id || 'usr_demo_019283746'}</span>
              </div>
            </div>
          </section>

          {/* Privacy & Statutory Compliance Disclosures */}
          <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Shield className="h-4 w-4" />
              <h2 className="text-sm font-semibold text-slate-100">Privacy Guarantees (§DOC-16)</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your strategy inputs and keyword mappings are strictly confidential. We never use client data to train external AI models. For full details on our zero-retention policies and sub-processors, visit our{' '}
              <Link href="/privacy" className="text-indigo-400 underline hover:text-indigo-300">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* Danger Zone: Account Deletion */}
          <section className="bg-rose-950/20 border border-rose-900/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-rose-200">Danger Zone — Cascade Account Deletion</h2>
                <p className="text-xs text-slate-400">
                  Permanently delete your account, projects, topical hierarchies, and entitlements.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-rose-900/40 text-xs text-slate-400 space-y-3">
              <p>
                In compliance with statutory requirements (§DOC-16 & Indian GST laws), transaction records will be severed and anonymized for statutory tax audit purposes, while all your project strategies will be permanently wiped.
              </p>

              {error && (
                <div className="bg-rose-950/90 border border-rose-800 text-rose-300 p-2.5 rounded text-xs">
                  {error}
                </div>
              )}

              {!deleteConfirmOpen ? (
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="border-rose-800 text-rose-300 hover:bg-rose-950/80 hover:text-rose-200 text-xs space-x-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete My Account & Data</span>
                </Button>
              ) : (
                <div className="bg-slate-950 border border-rose-900/60 p-4 rounded-md space-y-3">
                  <span className="block text-xs font-semibold text-rose-300">
                    Are you absolutely sure? This action is irreversible.
                  </span>
                  <p className="text-xs text-slate-400">
                    Please type <strong className="text-slate-100 font-mono">DELETE</strong> in all caps to confirm.
                  </p>
                  <input
                    type="text"
                    placeholder="DELETE"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <div className="flex space-x-2 pt-1">
                    <Button
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || deleteInput !== 'DELETE'}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium space-x-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{isDeleting ? 'Deleting...' : 'Confirm Cascade Deletion'}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDeleteConfirmOpen(false);
                        setDeleteInput('');
                        setError(null);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
