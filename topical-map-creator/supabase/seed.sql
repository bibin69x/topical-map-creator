-- Topical Authority Creator Seed Fixtures
-- Purpose: Initial seed data for local development, staging tests, and beta demonstration
-- Reference: DOC-05 Database Schema & DOC-18 Beta Runbook

-- 1. Insert Demo User Profile
INSERT INTO users_profile (id, email, full_name)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo.expert@agency.in', 'Demo SEO Specialist')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert User Entitlement Record (10 Credits Early Access Plan)
INSERT INTO entitlements (id, user_id, plan_tier, credits_remaining, total_credits_granted, is_paid)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'PAID_EARLY_ACCESS', 10, 10, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Starter Projects
INSERT INTO projects (id, user_id, primary_topic, website_url, target_country, language, status)
VALUES 
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Technical SEO Architecture',
    'https://example-saas.com',
    'IN',
    'en',
    'COMPLETED'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'B2B Content Marketing & Lead Gen',
    'https://b2b-growth.io',
    'IN',
    'en',
    'COMPLETED'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Verified Payment Transaction (Statutory Audit Record §DOC-16)
INSERT INTO payments (id, user_id, razorpay_order_id, razorpay_payment_id, amount_paise, currency, status)
VALUES 
  (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'order_early_access_001',
    'pay_verified_001',
    19900,
    'INR',
    'CAPTURED'
  )
ON CONFLICT (id) DO NOTHING;
