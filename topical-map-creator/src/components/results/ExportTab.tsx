'use client';

import { useState } from 'react';
import { EngineResult } from '@/lib/engine/types';
import { generateTopicsCSV } from '@/lib/services/export';
import { Download, Lock, CheckCircle, Sparkles, Printer } from 'lucide-react';
import { Button } from '../ui/button';
import { PdfReportView } from './PdfReportView';

export function ExportTab({ result, isPaid = false }: { result: EngineResult; isPaid?: boolean }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleDownloadCSV = () => {
    if (!isPaid) {
      setShowUpgradeModal(true);
      return;
    }
    const csvContent = generateTopicsCSV(result.topics);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${result.primaryTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-topical-map.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (!isPaid) {
      setShowUpgradeModal(true);
      return;
    }
    setShowPdfModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Free Plan Conversion Banner */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/80 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Unlock Full Export Capabilities — ₹199 Early Access</span>
            </div>
            <p className="text-xs text-slate-300">
              Your free topical map is ready! Upgrade to unlock unlimited CSV exports, PDF strategy reports, and 9 additional generation credits.
            </p>
          </div>
          <Button onClick={() => setShowUpgradeModal(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white shrink-0">
            Upgrade for ₹199
          </Button>
        </div>
      )}

      {/* Export Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Download className="h-4 w-4 text-indigo-400" />
              <span>Export CSV Topic Strategy</span>
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Download all {result.topics.length} topics, intent classifications, priority scores, and cluster groupings as a clean CSV spreadsheet.
            </p>
          </div>
          <div className="mt-6">
            <Button onClick={handleDownloadCSV} variant="outline" className="w-full justify-center space-x-2">
              {!isPaid && <Lock className="h-3.5 w-3.5 text-amber-400" />}
              <span>Download CSV File</span>
            </Button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Export Executive PDF Report</span>
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Generate a formatted executive PDF report showing visual clusters, internal-linking suggestions, and content creation priority roadmap.
            </p>
          </div>
          <div className="mt-6">
            <Button onClick={handleDownloadPDF} variant="outline" className="w-full justify-center space-x-2">
              {!isPaid && <Lock className="h-3.5 w-3.5 text-amber-400" />}
              <span>Download PDF Summary</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Printable Executive PDF Report Modal */}
      {showPdfModal && (
        <PdfReportView result={result} onClose={() => setShowPdfModal(false)} />
      )}

      {/* Upgrade Checkout Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-5">
            <div className="text-center">
              <span className="inline-block bg-indigo-950 text-indigo-400 border border-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-mono mb-3">
                ₹199 Early Access Offer
              </span>
              <h3 className="text-lg font-bold text-slate-100">Upgrade to Early Access</h3>
              <p className="text-xs text-slate-400 mt-1">Get instant access to exports and additional generation credits.</p>
            </div>

            <div className="space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>10 Complete Generation Credits</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Unlimited CSV & PDF Strategy Exports</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Advanced Internal Link Structure View</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Project Saving & History</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Button onClick={() => alert('Razorpay test checkout initiated!')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5">
                Pay ₹199 via Razorpay
              </Button>
              <Button onClick={() => setShowUpgradeModal(false)} variant="ghost" className="w-full text-slate-400">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
