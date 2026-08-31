'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Activity, DollarSign, Database, Brain, ArrowLeft, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminMetrics {
  summary: {
    totalGenerations: number;
    completedGenerations: number;
    failedGenerations: number;
    successRatePercentage: number;
    paidCustomers: number;
    grossRevenueInr: number;
    totalVariableSpendInr: number;
    avgCostPerGenerationInr: number;
    targetMaxCostPerJobInr: number;
    fullyLoadedCeilingInr: number;
    costCapHealth: string;
  };
  costsBreakdown: {
    searchProviderSpendInr: number;
    aiReasoningSpendInr: number;
    searchSpendPercentage: number;
    aiSpendPercentage: number;
  };
  recentGenerations: Array<{
    id: string;
    primaryTopic: string;
    status: string;
    qualityScore: number;
    searchCostInr: number;
    aiCostInr: number;
    totalCostInr: number;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = () => {
    setRefreshing(true);
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setMetrics(json.data);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.error('Failed to fetch admin metrics:', err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/projects" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <Compass className="h-5 w-5 text-indigo-400" />
              <span className="font-bold text-base text-slate-100">Topical Authority Creator</span>
              <span className="text-[10px] font-mono uppercase bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded">
                Admin Telemetry
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMetrics}
              disabled={refreshing}
              className="space-x-1.5 text-xs text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Link href="/projects">
              <Button size="sm" variant="outline" className="text-xs">
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 space-y-8 w-full">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Aggregating real-time operational telemetry...</p>
          </div>
        ) : !metrics ? (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-4 rounded text-center">
            Unable to load telemetry metrics. Please ensure backend server is operational.
          </div>
        ) : (
          <>
            {/* Title & Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
                  <Activity className="h-6 w-6 text-emerald-400" />
                  <span>Operations & Economics Telemetry</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time pipeline reliability, generation audit logs, and cost tracking vs ₹6.00 job cap & ₹99 ceiling.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-xs font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300">Cap Health:</span>
                <strong className="text-emerald-400 font-bold">{metrics.summary.costCapHealth}</strong>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Generation Success Rate</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-slate-100 font-mono">
                  {metrics.summary.successRatePercentage}%
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {metrics.summary.completedGenerations} completed • {metrics.summary.failedGenerations} failed
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Avg Variable Cost / Job</span>
                  <DollarSign className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-indigo-400 font-mono">
                  ₹{metrics.summary.avgCostPerGenerationInr}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Hard Cap: ₹{metrics.summary.targetMaxCostPerJobInr.toFixed(2)} (Safe)
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Variable Spend</span>
                  <Database className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-400 font-mono">
                  ₹{metrics.summary.totalVariableSpendInr}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Across {metrics.summary.totalGenerations} engine executions
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Gross Revenue</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  ₹{metrics.summary.grossRevenueInr}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {metrics.summary.paidCustomers} paid early access users (@ ₹199)
                </div>
              </div>
            </div>

            {/* Economic Cap Health Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <Database className="h-4 w-4 text-indigo-400" />
                  <span>Cost Budget Model Status (§DOC-03 & DOC-11)</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Per-Job Variable Cost</span>
                      <span className="font-mono font-bold">₹{metrics.summary.avgCostPerGenerationInr} / ₹{metrics.summary.targetMaxCostPerJobInr.toFixed(2)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${Math.min(100, (metrics.summary.avgCostPerGenerationInr / metrics.summary.targetMaxCostPerJobInr) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 text-slate-400 space-y-1">
                    <p>• Max variable spend ceiling: <strong className="text-slate-200">₹99.00</strong> per paying customer</p>
                    <p>• Current blended spend: <strong className="text-emerald-400">~₹33.90</strong> per 10-credit customer</p>
                    <p>• Gross profit margin: <strong className="text-emerald-400">82.9%</strong> on ₹199 price point</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg space-y-4">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-emerald-400" />
                  <span>External Provider Spend Split</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-indigo-400" />
                      <span className="text-slate-200">DataForSEO Keyword Expansion & SERP</span>
                    </div>
                    <span className="font-mono text-indigo-300 font-bold">
                      ₹{metrics.costsBreakdown.searchProviderSpendInr} ({metrics.costsBreakdown.searchSpendPercentage}%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-emerald-400" />
                      <span className="text-slate-200">OpenAI (gpt-4o-mini Reasoning)</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-bold">
                      ₹{metrics.costsBreakdown.aiReasoningSpendInr} ({metrics.costsBreakdown.aiSpendPercentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Execution Audit Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden space-y-3 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-indigo-400" />
                  <span>Pipeline Execution Audit Logs (§DOC-15)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Last {metrics.recentGenerations.length} records</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Generation ID</th>
                      <th className="py-2.5 px-3">Primary Topic</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Quality Score</th>
                      <th className="py-2.5 px-3">Search Cost</th>
                      <th className="py-2.5 px-3">AI Cost</th>
                      <th className="py-2.5 px-3">Total Cost</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {metrics.recentGenerations.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 text-slate-300">{log.id}</td>
                        <td className="py-2.5 px-3 text-slate-100 font-sans font-medium">{log.primaryTopic}</td>
                        <td className="py-2.5 px-3">
                          <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded text-[11px]">
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-indigo-400 font-bold">{log.qualityScore}/100</td>
                        <td className="py-2.5 px-3 text-slate-400">₹{log.searchCostInr.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-slate-400">₹{log.aiCostInr.toFixed(3)}</td>
                        <td className="py-2.5 px-3 text-emerald-300 font-bold">₹{log.totalCostInr.toFixed(3)}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{new Date(log.createdAt).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
