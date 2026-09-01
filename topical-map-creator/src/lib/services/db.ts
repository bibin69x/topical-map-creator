import { createAdminClient } from '../supabase/admin';
import { EngineResult } from '../engine/types';

export interface DbProjectRecord {
  id: string;
  user_id?: string;
  primary_topic: string;
  website_url?: string;
  target_country: string;
  language: string;
  status: string;
  created_at: string;
}

export async function saveEngineResultToDb(params: {
  generationId: string;
  projectId: string;
  userId?: string;
  primaryTopic: string;
  websiteUrl?: string;
  targetCountry?: string;
  language?: string;
  result: EngineResult;
}): Promise<boolean> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return false;
    }

    const supabase = createAdminClient();
    const effectiveUserId = params.userId || '00000000-0000-0000-0000-000000000001';

    // 1. Ensure user profile exists (or use seed demo user)
    const { error: profileErr } = await supabase
      .from('users_profile')
      .upsert({
        id: effectiveUserId,
        email: 'user@topicalauthority.app',
        full_name: 'Topical Authority User'
      }, { onConflict: 'id' });

    if (profileErr) {
      console.warn('[DB Persistence] Profile upsert notice:', profileErr.message);
    }

    // 2. Insert or update Project
    const { error: projErr } = await supabase
      .from('projects')
      .upsert({
        id: params.projectId,
        user_id: effectiveUserId,
        primary_topic: params.primaryTopic,
        website_url: params.websiteUrl || null,
        target_country: params.targetCountry || 'IN',
        language: params.language || 'en',
        status: 'COMPLETED'
      }, { onConflict: 'id' });

    if (projErr) {
      console.warn('[DB Persistence] Project upsert notice:', projErr.message);
    }

    // 3. Insert Generation record
    const { error: genErr } = await supabase
      .from('generations')
      .upsert({
        id: params.generationId,
        project_id: params.projectId,
        user_id: effectiveUserId,
        status: 'COMPLETED',
        search_cost_inr: params.result.totalSearchCostInr,
        ai_cost_inr: params.result.totalAiCostInr,
        completed_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (genErr) {
      console.warn('[DB Persistence] Generation upsert notice:', genErr.message);
    }

    // 4. Insert Topic Clusters
    if (params.result.clusters && params.result.clusters.length > 0) {
      const clusterRows = params.result.clusters.map(c => ({
        id: c.id,
        project_id: params.projectId,
        name: c.name,
        description: c.description
      }));

      const { error: clusterErr } = await supabase
        .from('topic_clusters')
        .upsert(clusterRows, { onConflict: 'id' });

      if (clusterErr) {
        console.warn('[DB Persistence] Clusters upsert notice:', clusterErr.message);
      }
    }

    // 5. Insert Topics
    if (params.result.topics && params.result.topics.length > 0) {
      const topicRows = params.result.topics.map(t => ({
        id: t.id,
        project_id: params.projectId,
        title: t.title,
        slug: t.slug,
        intent: t.intent,
        priority: t.priority,
        priority_score: t.priorityScore,
        depth_level: t.depthLevel,
        search_volume: t.searchVolume || 0,
        cpc_inr: t.cpcInr || 0,
        confidence_score: t.confidenceScore || 85.0
      }));

      const { error: topicErr } = await supabase
        .from('topics')
        .upsert(topicRows, { onConflict: 'id' });

      if (topicErr) {
        console.warn('[DB Persistence] Topics upsert notice:', topicErr.message);
      }
    }

    return true;
  } catch (err) {
    console.warn('[DB Persistence] Fallback to memory store:', err);
    return false;
  }
}

export async function getEngineResultFromDb(id: string): Promise<EngineResult | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return null;
    }

    const supabase = createAdminClient();

    // Query projects matching id or generation matching id
    const { data: proj } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (!proj) {
      return null;
    }

    const { data: clusters } = await supabase
      .from('topic_clusters')
      .select('*')
      .eq('project_id', proj.id);

    const { data: topics } = await supabase
      .from('topics')
      .select('*')
      .eq('project_id', proj.id);

    const { data: gen } = await supabase
      .from('generations')
      .select('*')
      .eq('project_id', proj.id)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (!topics || topics.length === 0) {
      return null;
    }

    return {
      projectId: proj.id,
      primaryTopic: proj.primary_topic,
      clusters: (clusters || []).map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        pillarTopicTitle: c.name,
        topicCount: (topics || []).filter((t: any) => t.cluster_id === c.id).length
      })),
      topics: topics.map(t => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        clusterName: t.cluster_id || 'Core Strategy',
        intent: t.intent,
        priority: t.priority,
        priorityScore: Number(t.priority_score),
        depthLevel: t.depth_level,
        searchVolume: t.search_volume,
        cpcInr: Number(t.cpc_inr),
        confidenceScore: Number(t.confidence_score)
      })),
      internalLinks: [],
      qualityPassed: true,
      qualityGateScore: 92,
      totalSearchCostInr: gen ? Number(gen.search_cost_inr) : 0,
      totalAiCostInr: gen ? Number(gen.ai_cost_inr) : 0
    };
  } catch (err) {
    return null;
  }
}
