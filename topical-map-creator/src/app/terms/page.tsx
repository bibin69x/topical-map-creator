import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Terms of Service : Topical Authority Creator',
  description: 'Terms of service, usage entitlements, and acceptable use policy.',
};

export default function TermsPage() {
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
            Legal Terms
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-400">Last updated: August 31, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Topical Authority Creator (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">2. Early Access & Credit Entitlement</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
            <p className="text-xs text-slate-300">
              The Service offers early access pricing of <strong>₹199 INR</strong>, which entitles the purchasing account to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
              <li>10 complete Topical Authority Map generations.</li>
              <li>Topic clustering, intent classification, priority scoring, and internal-linking directives.</li>
              <li>Unlimited CSV spreadsheet exports and executive PDF strategy reports for generated projects.</li>
              <li>Persistent project saving and retrieval.</li>
            </ul>
          </div>
          <p className="text-xs text-slate-400">
            One generation credit corresponds to one completed topical map run. Credits do not expire during the early access lifecycle.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">3. Free Plan Limitations</h2>
          <p className="text-xs text-slate-400">
            Free accounts receive one demonstration topical map generation. Free accounts have view-only access to basic cluster overviews and do not include CSV/PDF data exports or ongoing regeneration.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">4. Acceptable Use Policy</h2>
          <p className="text-xs text-slate-400">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li>Use automated scrapers, bots, or scripts to access or extract data from the Service.</li>
            <li>Create multiple disposable accounts to abuse the single-use free tier.</li>
            <li>Attempt prompt injection, reverse engineering, or disruption of the backend SEO pipeline.</li>
            <li>Resell raw API access to third parties without prior authorization.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">5. Service Availability & Disclaimers</h2>
          <p className="text-xs text-slate-400">
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis during the early access program. While we strive for high uptime and research accuracy, search engine algorithms change continually. Generated topical structures represent strategic recommendations, not guaranteed search ranking outcomes.
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
