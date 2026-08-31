import { NextResponse } from 'next/server';
import { activeGenerations } from '@/lib/engine/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projectsList: Array<{
      id: string;
      generationId: string;
      primaryTopic: string;
      websiteUrl: string;
      topicsCount: number;
      clustersCount: number;
      status: string;
      createdAt: string;
    }> = [];

    // Collect all generations in active in-memory store
    for (const [genId, gen] of activeGenerations.entries()) {
      projectsList.push({
        id: gen.projectId || genId,
        generationId: genId,
        primaryTopic: gen.primaryTopic || 'Untitled Topical Map',
        websiteUrl: gen.websiteUrl || '',
        topicsCount: gen.result?.topics?.length || (gen.status === 'COMPLETED' ? 15 : 0),
        clustersCount: gen.result?.clusters?.length || (gen.status === 'COMPLETED' ? 3 : 0),
        status: gen.status,
        createdAt: gen.createdAt || new Date().toISOString().split('T')[0]
      });
    }

    // Always ensure at least the baseline demonstration project is visible
    if (projectsList.length === 0) {
      projectsList.push({
        id: 'demo-proj-1',
        generationId: 'demo-proj-1',
        primaryTopic: 'Technical SEO Strategy',
        websiteUrl: 'https://example-seo-site.com',
        topicsCount: 15,
        clustersCount: 3,
        status: 'COMPLETED',
        createdAt: '2026-08-31'
      });
    }

    return NextResponse.json({
      success: true,
      data: projectsList
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to retrieve projects' },
      { status: 500 }
    );
  }
}
