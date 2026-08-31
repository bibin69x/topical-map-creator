import { NextResponse } from 'next/server';
import { TopicalAuthorityEngine } from '@/lib/engine/pipeline';
import { activeGenerations } from '@/lib/engine/store';
import { z } from 'zod';

export const dynamic = 'force-dynamic';


const triggerSchema = z.object({
  primaryTopic: z.string().min(2).max(100),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  targetCountry: z.string().default('IN'),
  language: z.string().default('en')
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = triggerSchema.parse(body);

    // Check concurrency lock: reject if a job is already processing (§DOC-14 & §DOC-06)
    const hasActiveJob = Array.from(activeGenerations.values()).some(
      g => g.status === 'PROCESSING' && Date.now() - parseInt(g.id.replace('gen-', '')) < 60000
    );
    if (hasActiveJob) {
      return NextResponse.json(
        {
          success: false,
          error: 'CONCURRENT_GENERATION_LIMIT: You already have an active topical generation in progress.'
        },
        { status: 409 }
      );
    }

    const generationId = `gen-${Date.now()}`;
    const projectId = `proj-${Date.now()}`;

    const createdAt = new Date().toISOString().split('T')[0];

    // Initialize queued job
    activeGenerations.set(generationId, {
      id: generationId,
      projectId,
      status: 'PROCESSING',
      primaryTopic: parsed.primaryTopic,
      websiteUrl: parsed.websiteUrl || '',
      createdAt,
      progressStage: 'RESEARCHING',
      result: null,
      error: null
    });

    // Execute engine pipeline asynchronously
    const engine = new TopicalAuthorityEngine();
    engine.executePipeline({
      projectId,
      primaryTopic: parsed.primaryTopic,
      websiteUrl: parsed.websiteUrl,
      targetCountry: parsed.targetCountry,
      language: parsed.language
    }).then(result => {
      activeGenerations.set(generationId, {
        id: generationId,
        projectId,
        status: 'COMPLETED',
        primaryTopic: parsed.primaryTopic,
        websiteUrl: parsed.websiteUrl || '',
        createdAt,
        progressStage: 'COMPLETED',
        result,
        error: null
      });
    }).catch(err => {
      activeGenerations.set(generationId, {
        id: generationId,
        projectId,
        status: 'FAILED',
        primaryTopic: parsed.primaryTopic,
        websiteUrl: parsed.websiteUrl || '',
        createdAt,
        progressStage: 'FAILED',
        result: null,
        error: err.message || 'Generation failed'
      });
    });

    return NextResponse.json({
      success: true,
      generationId,
      projectId,
      status: 'PROCESSING'
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid request parameters' },
      { status: 400 }
    );
  }
}
