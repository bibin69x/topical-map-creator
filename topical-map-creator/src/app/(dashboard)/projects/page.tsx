'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, Folder, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Folder className="h-6 w-6 text-indigo-400" />
            <span>Topical Authority Projects</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your generated topical authority maps and content strategies.
          </p>
        </div>

        <Link href="/create">
          <Button className="space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white">
            <PlusCircle className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading your saved projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-12 text-center space-y-4">
          <Folder className="h-10 w-10 text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-semibold text-slate-200">No Projects Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Create your first topical authority map to get started.
            </p>
          </div>
          <Link href="/create">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Create My First Map
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => {
            const targetUrl = `/projects/${project.generationId || project.id}`;
            return (
              <div
                key={project.generationId || project.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Compass className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-base font-semibold text-slate-100">{project.primaryTopic}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {project.websiteUrl || 'No website target specified'}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs font-mono text-slate-400">
                    <span>{project.topicsCount} Topics</span>
                    <span>•</span>
                    <span>{project.clustersCount} Clusters</span>
                    <span>•</span>
                    <span>Created {project.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded border ${
                      project.status === 'COMPLETED'
                        ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                        : project.status === 'FAILED'
                        ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                        : 'bg-amber-950/80 border-amber-800 text-amber-300'
                    }`}
                  >
                    {project.status}
                  </span>
                  <Link href={targetUrl}>
                    <Button variant="outline" size="sm" className="space-x-1.5">
                      <span>View Map</span>
                      <ArrowRight className="h-3.5 w-3.5" />
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
