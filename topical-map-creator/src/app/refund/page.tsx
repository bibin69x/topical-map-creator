import Link from 'next/link';
import { Compass, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Refund Policy — Topical Authority Creator',
  description: 'Refund policy, credit safeguards, and automatic error refund workflows.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center space-x-2 text-indigo-400 font-bold text-lg">
            <Compass className="h-6 w-6" />
            <span className="text-slate-100 font-semibold">Topical Authority Creator</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="space-x-1 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/80 border border-indigo-800 text-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-mono">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Customer Protection & Fair Billing</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 31, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">1. Real-Time Generation Credit Refund Safeguard</h2>
          <p>
            We believe you should only pay for successful SEO strategy results. Our generation pipeline is backed by automated transactional credit restoration:
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Automated Pipeline Failure Restorations</h3>
                <p className="text-xs text-slate-400 mt-1">
                  If an in-flight generation encounters a server timeout, provider outage, or fails quality validation gates, the credit is <strong>immediately refunded back to your account balance</strong> automatically. You do not need to contact support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">2. Monetary Refund Policy (₹199 Early Access)</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
            <li>
              <strong className="text-slate-200">7-Day Unused Guarantee:</strong> If you purchase the ₹199 Early Access pack and have consumed <strong>0 of your 10 credits</strong>, you may request a 100% full monetary refund within 7 days of purchase.
            </li>
            <li>
              <strong className="text-slate-200">Used Credits:</strong> Because external research APIs (DataForSEO) and LLM inference resources incur immediate, unrecoverable operational costs per generation, accounts that have consumed generation credits are generally non-refundable.
            </li>
            <li>
              <strong className="text-slate-200">Billing Errors & Duplicate Charges:</strong> Any duplicate payment charges or technical gateway errors via Razorpay are eligible for immediate 100% refund upon notification.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">3. How to Request a Refund</h2>
          <p className="text-xs text-slate-400">
            To request a refund under the 7-day unused policy or report a billing discrepancy, please submit your Razorpay payment ID and account email address to our support desk. Monetary refunds are credited back to your original payment method within 5–7 business days via Razorpay.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        Topical Authority Creator MVP © 2026. All rights reserved.
      </footer>
    </div>
  );
}
