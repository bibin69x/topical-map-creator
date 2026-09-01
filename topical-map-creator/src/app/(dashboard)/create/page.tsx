'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CreateProjectPage() {
  const router = useRouter();
  const [primaryTopic, setPrimaryTopic] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [country, setCountry] = useState('IN');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryTopic.trim()) {
      setError('Please enter a primary topic.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generations/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryTopic,
          websiteUrl,
          targetCountry: country,
          language
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize generation');
      }

      router.push(`/projects/${data.generationId}/generating`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 py-4">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Create New Topical Map
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Specify your primary niche topic and market location to generate content clusters and hierarchy.
        </p>
      </div>

      {error && (
        <div className="bg-rose-950 border border-rose-800 text-rose-200 text-xs p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Primary Niche / Topic <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Technical SEO, Organic Dog Food, B2B SaaS Content Marketing"
            value={primaryTopic}
            onChange={(e) => setPrimaryTopic(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">
            Website URL <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Target Market</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-400"
            >
              <option value="IN">India (IN)</option>
              <option value="US">United States (US)</option>
              <option value="GB">United Kingdom (GB)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-400"
            >
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full justify-center"
          >
            {loading ? 'Initializing Topical Engine...' : 'Generate Topical Map'}
          </Button>
        </div>
      </form>
    </div>
  );
}

