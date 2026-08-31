'use client';

import { useState } from 'react';
import { Star, MessageSquare, CheckCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

export function FeedbackWidget({ generationId }: { generationId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<'QUALITY' | 'ACCURACY' | 'SPEED' | 'GENERAL'>('QUALITY');
  const [comments, setComments] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationId,
          rating,
          category,
          comments,
          userEmail: userEmail || undefined
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Error sending feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-lg p-5 flex items-center space-x-3 text-emerald-400">
        <CheckCircle className="h-5 w-5 shrink-0" />
        <div>
          <h4 className="text-xs font-semibold text-slate-100">Thank you for your beta feedback!</h4>
          <p className="text-[11px] text-slate-400">Your ratings directly guide our topical engine algorithm tuning.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-semibold text-slate-200">Beta User Quality Feedback</h4>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          Early Access Cohort
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Did this topical map deliver the structure and depth you needed? Your feedback helps tune our clustering algorithms.
      </p>

      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Star Rating */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-slate-400 mr-2 font-medium">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating !== null ? hoverRating : rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition-colors focus:outline-none"
                >
                  <Star className={`h-4 w-4 ${active ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Focus:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="QUALITY">Topic Quality & Depth</option>
              <option value="ACCURACY">Intent & Hierarchy Accuracy</option>
              <option value="SPEED">Generation Speed</option>
              <option value="GENERAL">General Experience</option>
            </select>
          </div>
        </div>

        <div>
          <textarea
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any thoughts, missing subtopics, or suggestions (optional)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Your email (optional, for follow-up)"
            className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-64"
          />

          <Button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-1.5 flex items-center space-x-1.5"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Submit Feedback</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
