'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
          Account & Entitlements
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your plan entitlements, generation credits, privacy preferences, and account controls.
        </p>
      </div>

      {deletionSuccess ? (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-5 rounded space-y-2 text-center">
          <h2 className="text-sm font-bold text-white">Account Successfully Deleted</h2>
          <p className="text-xs text-slate-300">
            All your projects, topical maps, and personal data have been permanently purged. Redirecting...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Plan & Entitlements Section */}
          <section className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold text-white">Plan & Generation Entitlements</h2>
                <p className="text-xs text-slate-400">
                  {isPaid ? '₹199 Early Access (10 Generations Plan)' : 'Free Evaluation Plan (1 Initial Generation)'}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-bold ${
                isPaid 
                  ? 'bg-slate-950 text-slate-200 border-slate-700' 
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {isPaid ? 'PAID ACCESS' : 'FREE TIER'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Available Credits</span>
                <span className="text-xl font-bold font-mono text-white">{credits}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  1 credit = 1 complete topical authority map
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Early Access Upgrade</span>
                  <span className="text-xs text-slate-300">
                    Unlock 10 complete topical maps + full CSV & PDF exports for ₹199.
                  </span>
                </div>
                <Link href="/create" className="mt-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    <span>Create New Map</span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* User Profile Details */}
          <section className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
            <div>
              <h2 className="text-xs font-semibold text-white">User Profile</h2>
              <p className="text-xs text-slate-400">Authenticated account details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Email Address:</span>
                <span className="text-white font-mono">{user?.email || 'demo.user@agency.in'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Account ID:</span>
                <span className="text-white font-mono truncate block">{user?.id || 'usr_demo_019283746'}</span>
              </div>
            </div>
          </section>

          {/* Privacy & Statutory Compliance Disclosures */}
          <section className="bg-slate-900 border border-slate-800 rounded p-5 space-y-2">
            <h2 className="text-xs font-semibold text-white">Privacy Guarantees</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your strategy inputs and keyword mappings are strictly confidential. We never use client data to train external AI models. For full details on our zero-retention policies and sub-processors, visit our{' '}
              <Link href="/privacy" className="text-slate-200 underline hover:text-white">
                Privacy Policy
              </Link>.
            </p>
          </section>

          {/* Danger Zone: Account Deletion */}
          <section className="bg-slate-900 border border-rose-900/60 rounded p-5 space-y-3">
            <div>
              <h2 className="text-xs font-semibold text-rose-300">Danger Zone: Cascade Account Deletion</h2>
              <p className="text-xs text-slate-400">
                Permanently delete your account, projects, topical hierarchies, and entitlements.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-3">
              <p>
                In compliance with statutory tax audit regulations (Indian GST laws), transaction receipts will be severed and anonymized, while all project maps and personal identifiers will be permanently wiped.
              </p>

              {error && (
                <div className="bg-rose-950 border border-rose-800 text-rose-200 p-2.5 rounded text-xs">
                  {error}
                </div>
              )}

              {!deleteConfirmOpen ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <span>Delete My Account & Data</span>
                </Button>
              ) : (
                <div className="bg-slate-950 border border-rose-900/80 p-3.5 rounded space-y-2.5">
                  <span className="block text-xs font-semibold text-rose-300">
                    Are you sure? This action is permanent and cannot be undone.
                  </span>
                  <p className="text-xs text-slate-400">
                    Type <strong className="text-white font-mono">DELETE</strong> in all caps to confirm.
                  </p>
                  <input
                    type="text"
                    placeholder="DELETE"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                  <div className="flex space-x-2 pt-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || deleteInput !== 'DELETE'}
                    >
                      <span>{isDeleting ? 'Deleting...' : 'Confirm Permanent Deletion'}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDeleteConfirmOpen(false);
                        setDeleteInput('');
                        setError(null);
                      }}
                      className="text-xs text-slate-400"
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

