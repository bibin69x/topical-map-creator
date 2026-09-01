'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectItem {
  id: string;
  generationId: string;
  primaryTopic: string;
  websiteUrl: string;
  topicsCount: number;
  clustersCount: number;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Topical Authority Projects
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your generated topical authority maps and content architectures.
          </p>
        </div>

        <Link href="/create">
          <Button size="sm">
            <span>New Map</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center space-y-2">
          <p className="text-xs text-slate-400 font-mono">Loading saved projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded p-8 text-center space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-white">No Projects Yet</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create your first topical authority map to get started.
            </p>
          </div>
          <Link href="/create">
            <Button size="sm">
              Create Topical Map
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => {
            const targetUrl = `/projects/${project.generationId || project.id}`;
            return (
              <div
                key={project.generationId || project.id}
                className="bg-slate-900 border border-slate-800 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700"
              >
                <div>
                  <h3 className="text-sm font-semibold text-white">{project.primaryTopic}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {project.websiteUrl || 'No URL specified'}
                  </p>
                  <div className="mt-1.5 flex items-center space-x-3 text-xs font-mono text-slate-500">
                    <span>{project.topicsCount} Topics</span>
                    <span>•</span>
                    <span>{project.clustersCount} Clusters</span>
                    <span>•</span>
                    <span>Created: {project.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold ${
                      project.status === 'COMPLETED'
                        ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                        : project.status === 'FAILED'
                        ? 'bg-rose-950 border-rose-800 text-rose-300'
                        : 'bg-amber-950 border-amber-800 text-amber-300'
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link href={targetUrl}>
                    <Button variant="outline" size="sm" className="space-x-1">
                      <span>Open Map</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

