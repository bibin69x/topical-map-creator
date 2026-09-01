import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const sampleTopics = [
    { title: 'Technical SEO Audit Checklist: 2026 Edition', cluster: 'Crawlability & Indexing', intent: 'COMMERCIAL', score: 94.5, depth: 1, link: 'Pillar Root' },
    { title: 'How to Fix Crawl Errors in Google Search Console', cluster: 'Crawlability & Indexing', intent: 'INFORMATIONAL', score: 88.0, depth: 2, link: '↳ Technical SEO Audit Checklist' },
    { title: 'Handling Faceted Navigation Canonicalization', cluster: 'Crawlability & Indexing', intent: 'INFORMATIONAL', score: 76.5, depth: 3, link: '↳ How to Fix Crawl Errors' },
    { title: 'Core Web Vitals Guide: Optimizing INP & LCP', cluster: 'Page Speed & Performance', intent: 'COMMERCIAL', score: 91.0, depth: 1, link: 'Pillar Root' },
    { title: 'Server-Side Rendering SEO Best Practices', cluster: 'Architecture & Rendering', intent: 'INFORMATIONAL', score: 82.0, depth: 2, link: '↳ Core Web Vitals Guide' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-screen">
      {/* Solid Minimal Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold tracking-tight text-white uppercase font-mono">Topical Authority Creator</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">V1.0</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/create">
              <Button size="sm">Open Generator</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-10 px-4 max-w-5xl mx-auto text-left w-full space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Topical Authority Map Generator
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Generate structured topic hierarchies, semantic clusters, search intent classifications, and internal linking directives without expensive enterprise subscriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/create">
            <Button size="lg">
              Generate Topical Map
            </Button>
          </Link>
          <span className="text-xs text-slate-400 font-mono">
            1 Free Generation included • ₹199 for 10 Full Credits
          </span>
        </div>
      </section>

      {/* Live Sample Workbench Preview (No generic icon boxes) */}
      <section className="px-4 max-w-5xl mx-auto w-full pb-16">
        <div className="border border-slate-800 bg-slate-900 rounded">
          <div className="border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 bg-slate-950/80">
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-200 font-semibold">Example Output:</span>
              <span className="text-slate-400">Technical SEO Strategy</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
              <span>32 Topics</span>
              <span>•</span>
              <span>5 Clusters</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Quality Score: 95/100</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900">
                  <th className="py-2.5 px-4 font-semibold">Topic / Article Headline</th>
                  <th className="py-2.5 px-4 font-semibold">Content Cluster</th>
                  <th className="py-2.5 px-4 font-semibold">Search Intent</th>
                  <th className="py-2.5 px-4 font-semibold">Priority Score</th>
                  <th className="py-2.5 px-4 font-semibold">Internal Linking Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {sampleTopics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="py-2.5 px-4 font-sans font-medium text-white">{row.title}</td>
                    <td className="py-2.5 px-4 text-slate-300 font-sans">{row.cluster}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] ${
                        row.intent === 'COMMERCIAL' ? 'bg-amber-950 border-amber-800 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}>
                        {row.intent}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-100">{row.score}</td>
                    <td className="py-2.5 px-4 text-slate-400 text-[11px]">{row.link}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Structured Feature Breakdown */}
      <section className="border-t border-slate-800 bg-slate-900 py-14 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Structured SEO Logic</h2>
            <p className="text-xs text-slate-400 mt-1">Deterministic formulas and search signals instead of generic AI prompts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="border border-slate-800 bg-slate-950 p-5 rounded space-y-2">
              <h3 className="font-semibold text-white text-sm">1. Multi-Stage Expansion</h3>
              <p className="text-slate-400 leading-relaxed">
                Deconstructs your primary niche into core topical dimensions and extracts candidate search keywords.
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-950 p-5 rounded space-y-2">
              <h3 className="font-semibold text-white text-sm">2. Deterministic Scoring</h3>
              <p className="text-slate-400 leading-relaxed">
                35% search evidence, 35% cluster centrality, 20% intent weight, and 10% data confidence calculate exact 0-100 priority scores.
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-950 p-5 rounded space-y-2">
              <h3 className="font-semibold text-white text-sm">3. DAG Internal Linking</h3>
              <p className="text-slate-400 leading-relaxed">
                Calculates directed parent-child and pillar-supporting internal linking directives with exact anchor text recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Plan Details */}
      <section className="py-14 px-4 max-w-5xl mx-auto w-full">
        <div className="border border-slate-800 bg-slate-900 p-8 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">₹199 Early Access Entitlement</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              10 full Topical Authority Map generation credits with project saving, complete 6-tab analysis, CSV spreadsheets, and printable executive reports.
            </p>
          </div>
          <Link href="/create">
            <Button size="lg" className="shrink-0">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400 mb-2">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-white">Refund Policy</Link>
        </div>
        <p>Topical Authority Creator V1.0. Built for SEO practitioners and digital marketing professionals.</p>
      </footer>
    </div>
  );
}

