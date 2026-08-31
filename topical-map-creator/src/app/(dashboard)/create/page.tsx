'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';
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
    <div className="max-w-xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
          <Compass className="h-6 w-6 text-indigo-400" />
          <span>Create New Topical Map</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter your niche or primary pillar topic to build an actionable topical authority architecture.
        </p>
      </div>

      {error && (
        <div className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-3 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Primary Topic <span className="text-indigo-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Technical SEO, Content Marketing, Electric Vehicles"
            value={primaryTopic}
            onChange={(e) => setPrimaryTopic(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Website URL <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="IN">India (IN)</option>
              <option value="US">United States (US)</option>
              <option value="GB">United Kingdom (GB)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? 'Initializing Engine...' : 'Generate Topical Map'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
