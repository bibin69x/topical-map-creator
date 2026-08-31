import Link from 'next/link';
import { Compass, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Privacy Policy — Topical Authority Creator',
  description: 'Privacy policy, sub-processors, and customer data isolation guarantees.',
};

export default function PrivacyPage() {
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
            <Shield className="h-3.5 w-3.5" />
            <span>Privacy & Data Protection</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 31, 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">1. Core Privacy Commitments</h2>
          <p>
            Topical Authority Creator (&quot;we&quot;, &quot;our&quot;, or &quot;the Service&quot;) is committed to minimal data collection and transparent processing. We do not sell your personal data or your SEO project strategies to third parties.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-slate-200 text-sm">Strict Zero-AI-Training Guarantee:</h3>
            <p className="text-xs text-slate-400">
              Customer project inputs, primary topic queries, target URLs, and resulting topical maps are <strong>NEVER used to train public LLM models</strong>. OpenAI API calls are executed with enterprise zero-retention parameters where user prompt content is excluded from training.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-400">
            <li><strong className="text-slate-200">Account Information:</strong> Email address and authentication credentials managed securely via Supabase Auth.</li>
            <li><strong className="text-slate-200">Project Inputs:</strong> Primary topics, domain URLs, target country, and language preferences entered to generate topical maps.</li>
            <li><strong className="text-slate-200">Transaction Records:</strong> Razorpay payment order IDs, amounts, and settlement status for entitlement provisioning and India GST audit compliance.</li>
            <li><strong className="text-slate-200">System Logs:</strong> Anonymous generation latency, token counts, and error telemetry to maintain service reliability.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">3. Third-Party Sub-Processors</h2>
          <p className="text-xs text-slate-400">We utilize vetted infrastructure providers to deliver the Service:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-800">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="p-2.5 border-b border-slate-800">Sub-Processor</th>
                  <th className="p-2.5 border-b border-slate-800">Purpose</th>
                  <th className="p-2.5 border-b border-slate-800">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-400">
                <tr>
                  <td className="p-2.5 font-medium text-slate-200">OpenAI</td>
                  <td className="p-2.5">Topic semantic clustering & intent categorization</td>
                  <td className="p-2.5">United States</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-200">DataForSEO</td>
                  <td className="p-2.5">Public Google SERP & keyword search volume retrieval</td>
                  <td className="p-2.5">United States / EU</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-200">Supabase (AWS)</td>
                  <td className="p-2.5">PostgreSQL database hosting & user authentication</td>
                  <td className="p-2.5">India / Singapore</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-200">Razorpay</td>
                  <td className="p-2.5">Payment gateway processing & billing settlement</td>
                  <td className="p-2.5">India</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-200">Vercel</td>
                  <td className="p-2.5">Edge application hosting & serverless runtime</td>
                  <td className="p-2.5">Global Edge Network</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">4. Data Isolation & Security</h2>
          <p className="text-xs text-slate-400">
            All database tables enforce PostgreSQL Row-Level Security (RLS). A user cannot view, modify, or query another user&apos;s projects or topical maps. Public research caches do not store any identifying user metadata.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-lg font-bold text-slate-100">5. Self-Service Account & Data Deletion</h2>
          <p className="text-xs text-slate-400">
            You retain complete ownership of your data. You may trigger an immediate, automated cascade deletion of your account, projects, topical maps, and exported files via the application interface or API (`DELETE /api/user/account`). In compliance with Indian commercial and tax laws, payment settlement transaction IDs are anonymized and retained solely for statutory audit obligations.
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
