'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [acknowledged, setAcknowledged] = useState(true); // Default true to avoid SSR layout flash

  useEffect(() => {
    try {
      const consent = localStorage.getItem('tac_cookie_consent');
      if (!consent) {
        setAcknowledged(false);
      }
    } catch {
      // Ignored
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('tac_cookie_consent', 'accepted');
    } catch {
      // Ignored
    }
    setAcknowledged(true);
  };

  if (acknowledged) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Notice"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md text-xs text-slate-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <Cookie className="h-4 w-4 text-amber-400 shrink-0" />
          <p>
            We use essential cookies and local storage to manage user authentication sessions and prevent credit abuse. No ad tracking or third-party cookies. Learn more in our{' '}
            <Link href="/privacy" className="text-indigo-400 underline hover:text-indigo-300">
              Privacy Policy
            </Link>.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <Button
            size="sm"
            onClick={handleAccept}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-7 px-3"
          >
            Got it
          </Button>
          <button
            onClick={handleAccept}
            className="text-slate-400 hover:text-slate-200 p-1"
            title="Dismiss notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
