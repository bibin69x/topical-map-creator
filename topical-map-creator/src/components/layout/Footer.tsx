import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 py-6 px-4 bg-slate-950 text-center text-xs text-slate-500 space-y-2">
      <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400">
        <Link href="/privacy" className="hover:text-slate-200 transition-colors">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-slate-200 transition-colors">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/refund" className="hover:text-slate-200 transition-colors">
          Refund Policy
        </Link>
        <span>•</span>
        <Link href="/settings" className="hover:text-slate-200 transition-colors">
          Account Settings
        </Link>
      </div>
      <p>Topical Authority Creator MVP © 2026. DataForSEO • OpenAI • Supabase • Razorpay.</p>
    </footer>
  );
}
