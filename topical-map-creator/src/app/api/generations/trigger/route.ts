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

    const generationId = `gen-${Date.now()}`;
    const projectId = `proj-${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];

    // Initialize queued job in persistent store
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

    // Execute engine pipeline
    try {
      const engine = new TopicalAuthorityEngine();
      const result = await engine.executePipeline({
        projectId,
        primaryTopic: parsed.primaryTopic,
        websiteUrl: parsed.websiteUrl,
        targetCountry: parsed.targetCountry,
        language: parsed.language
      });

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

      return NextResponse.json({
        success: true,
        generationId,
        projectId,
        status: 'COMPLETED'
      });
    } catch (pipelineErr: any) {
      console.error('[TopicalEngine Pipeline Error]:', pipelineErr);
      activeGenerations.set(generationId, {
        id: generationId,
        projectId,
        status: 'FAILED',
        primaryTopic: parsed.primaryTopic,
        websiteUrl: parsed.websiteUrl || '',
        createdAt,
        progressStage: 'FAILED',
        result: null,
        error: pipelineErr.message || 'Engine generation failed'
      });

      return NextResponse.json(
        { success: false, error: pipelineErr.message || 'Pipeline execution failed', generationId },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid request parameters' },
      { status: 400 }
    );
  }
}
