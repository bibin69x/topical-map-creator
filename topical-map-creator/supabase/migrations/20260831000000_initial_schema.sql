-- Topical Authority Creator Complete PostgreSQL DDL Schema
-- Specification Reference: DOC-05

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM Types
CREATE TYPE project_status AS ENUM (
  'QUEUED',
  'RESEARCHING',
  'EXPANDING_TOPICS',
  'CLUSTERING',
  'ANALYZING_INTENT',
  'PRIORITIZING',
  'BUILDING_MAP',
  'COMPLETED',
  'FAILED'
);

CREATE TYPE generation_status AS ENUM (
  'QUEUED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REFUNDED'
);

CREATE TYPE intent_type AS ENUM (
  'INFORMATIONAL',
  'COMMERCIAL',
  'TRANSACTIONAL',
  'NAVIGATIONAL'
);

CREATE TYPE priority_level AS ENUM (
  'HIGH',
  'MEDIUM',
  'LOW'
);

CREATE TYPE link_relationship_type AS ENUM (
  'PARENT_CHILD',
  'PILLAR_SUPPORTING',
  'RELATED_CLUSTER'
);

CREATE TYPE transaction_type AS ENUM (
  'SIGNUP_FREE_GRANT',
  'PURCHASE_GRANT',
  'GENERATION_DEDUCTION',
  'SYSTEM_REFUND'
);

-- 2. Tables

-- User Profiles
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Entitlements
CREATE TABLE entitlements (
  user_id UUID PRIMARY KEY REFERENCES users_profile(id) ON DELETE CASCADE,
  credits_remaining INT NOT NULL DEFAULT 1 CHECK (credits_remaining >= 0),
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  primary_topic TEXT NOT NULL,
  website_url TEXT,
  target_country TEXT NOT NULL DEFAULT 'IN',
  language TEXT NOT NULL DEFAULT 'en',
  status project_status NOT NULL DEFAULT 'QUEUED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generations Audit
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  status generation_status NOT NULL DEFAULT 'QUEUED',
  search_cost_inr NUMERIC(8,4) DEFAULT 0.0000,
  ai_cost_inr NUMERIC(8,4) DEFAULT 0.0000,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Topic Clusters
CREATE TABLE topic_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  pillar_topic_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  cluster_id UUID REFERENCES topic_clusters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  intent intent_type NOT NULL DEFAULT 'INFORMATIONAL',
  priority priority_level NOT NULL DEFAULT 'MEDIUM',
  priority_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
  parent_topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  depth_level INT NOT NULL DEFAULT 1,
  search_volume INT,
  cpc_inr NUMERIC(8,2),
  confidence_score NUMERIC(5,2) NOT NULL DEFAULT 80.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Internal Links
CREATE TABLE internal_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  source_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  target_topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  relationship_type link_relationship_type NOT NULL DEFAULT 'PARENT_CHILD',
  anchor_text_suggestion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Research Cache (Shared SERP data)
CREATE TABLE research_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_hash TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  language TEXT NOT NULL,
  response_json JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Credit Transactions Log
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  transaction_type transaction_type NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- API Audit Log
CREATE TABLE api_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  cost_inr NUMERIC(8,4) NOT NULL DEFAULT 0.0000,
  duration_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Legal Consents
CREATE TABLE legal_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users_profile(id) ON DELETE CASCADE,
  accepted_terms BOOLEAN NOT NULL DEFAULT TRUE,
  accepted_privacy BOOLEAN NOT NULL DEFAULT TRUE,
  ip_address TEXT,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users_profile FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own entitlements" ON entitlements FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own topics" ON topics FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = topics.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can view own clusters" ON topic_clusters FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = topic_clusters.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can view own links" ON internal_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = internal_links.project_id AND projects.user_id = auth.uid())
);

-- 4. Triggers & Stored Functions

-- Auto User Signup Profile & 1 Free Credit Grant
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_profile (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO entitlements (user_id, credits_remaining, is_paid)
  VALUES (NEW.id, 1, FALSE);

  INSERT INTO credit_transactions (user_id, amount, transaction_type, reference_id)
  VALUES (NEW.id, 1, 'SIGNUP_FREE_GRANT', 'WELCOME_BONUS');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_signup();

-- Transactional Refund Credit Trigger
CREATE OR REPLACE FUNCTION refund_generation_credit(p_generation_id UUID, p_error_msg TEXT)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  UPDATE generations
  SET status = 'FAILED', error_message = p_error_msg
  WHERE id = p_generation_id AND status != 'FAILED'
  RETURNING user_id INTO v_user_id;

  IF v_user_id IS NOT NULL THEN
    UPDATE entitlements
    SET credits_remaining = credits_remaining + 1, updated_at = NOW()
    WHERE user_id = v_user_id;

    INSERT INTO credit_transactions (user_id, amount, transaction_type, reference_id)
    VALUES (v_user_id, 1, 'SYSTEM_REFUND', p_generation_id::TEXT);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cascade Account Deletion & Tax Audit Anonymization (§DOC-16)
CREATE OR REPLACE FUNCTION delete_user_account_data(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- 1. Cascade delete project entities
  DELETE FROM projects WHERE user_id = p_user_id;
  DELETE FROM generations WHERE user_id = p_user_id;
  DELETE FROM entitlements WHERE user_id = p_user_id;
  DELETE FROM legal_consents WHERE user_id = p_user_id;
  DELETE FROM credit_transactions WHERE user_id = p_user_id;
  DELETE FROM users_profile WHERE id = p_user_id;

  -- 2. Anonymize payment logs for India GST tax retention compliance (§32)
  UPDATE payments
  SET user_id = NULL
  WHERE user_id = p_user_id;

  -- 3. Delete auth user record
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

