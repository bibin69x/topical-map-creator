'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
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
      className="fixed bottom-0 inset-x-0 z-50 p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p>
          We use essential session tokens and local storage for authentication and credit abuse prevention. No advertising tracking. Review our{' '}
          <Link href="/privacy" className="text-white underline hover:text-slate-200">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
          <Button
            size="sm"
            onClick={handleAccept}
          >
            Acknowledge
          </Button>
          <button
            onClick={handleAccept}
            className="text-slate-400 hover:text-white p-1"
            title="Dismiss notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

