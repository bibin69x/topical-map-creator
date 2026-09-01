import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Refund Policy : Topical Authority Creator',
  description: 'Refund policy, credit safeguards, and automatic error refund workflows.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-bold text-sm text-white uppercase font-mono">
            Topical Authority Creator
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="space-x-1 text-slate-400 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-1 border-b border-slate-800 pb-4">
          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
            Customer Protection
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 31, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">1. Real-Time Generation Credit Refund Safeguard</h2>
          <p>
            We believe you should only pay for successful SEO strategy results. Our generation pipeline is backed by automated transactional credit restoration:
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded p-4 space-y-2">
            <h3 className="font-semibold text-white text-xs">Automated Pipeline Failure Restorations</h3>
            <p className="text-xs text-slate-400">
              If an in-flight generation encounters a server timeout, provider outage, or fails quality validation gates, the credit is <strong>immediately refunded back to your account balance</strong> automatically. You do not need to contact support.
            </p>
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
