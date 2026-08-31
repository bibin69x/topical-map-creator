import { NextResponse } from 'next/server';
import { TopicalAuthorityEngine } from '@/lib/engine/pipeline';
import { z } from 'zod';

const triggerSchema = z.object({
  primaryTopic: z.string().min(2).max(100),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  targetCountry: z.string().default('IN'),
  language: z.string().default('en')
});

// In-memory job store for MVP demonstration & testing
export const activeGenerations = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = triggerSchema.parse(body);

    const generationId = `gen-${Date.now()}`;
    const projectId = `proj-${Date.now()}`;

    // Initialize queued job
    activeGenerations.set(generationId, {
      id: generationId,
      projectId,
      status: 'PROCESSING',
      primaryTopic: parsed.primaryTopic,
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
