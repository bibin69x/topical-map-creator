import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Topical Authority Creator — Build SEO Topical Maps Without Expensive Tools',
  description: 'Generate structured SEO topic clusters, search intent, priority scoring, and internal-linking relationships in minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
