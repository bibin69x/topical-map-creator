import Link from 'next/link';
import { Compass, Folder, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const sampleProjects = [
    {
      id: 'demo-proj-1',
      primaryTopic: 'Technical SEO Strategy',
      websiteUrl: 'https://example-seo-site.com',
      topicsCount: 15,
      clustersCount: 3,
      status: 'COMPLETED',
      createdAt: '2026-08-31'
    }
  ];

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

      <div className="grid grid-cols-1 gap-4">
        {sampleProjects.map((project) => (
          <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Compass className="h-4 w-4 text-indigo-400" />
                <h3 className="text-base font-semibold text-slate-100">{project.primaryTopic}</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">{project.websiteUrl || 'No website target specified'}</p>
              <div className="mt-2 flex items-center space-x-4 text-xs font-mono text-slate-400">
                <span>{project.topicsCount} Topics</span>
                <span>{project.clustersCount} Clusters</span>
                <span>Created {project.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded">
                {project.status}
              </span>
              <Link href={`/projects/${project.id}`}>
                <Button variant="outline" size="sm" className="space-x-1.5">
                  <span>View Map</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
