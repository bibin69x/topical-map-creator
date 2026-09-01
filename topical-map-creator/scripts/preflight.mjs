#!/usr/bin/env node

/**
 * Pre-Flight Deployment Validation Script
 * Verifies system files, environment schemas, and configuration integrity
 * Reference: DOC-18 & Definition of Done (§40)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function checkSystemFiles() {
  const criticalFiles = [
    '.env.example',
    'supabase/migrations/20260831000000_initial_schema.sql',
    'supabase/seed.sql',
    'src/lib/engine/pipeline.ts',
    'src/lib/supabase/admin.ts',
    'src/lib/services/db.ts',
    'src/lib/services/account.ts',
    'src/lib/services/payment.ts',
    'src/lib/services/health.ts',
    'src/lib/services/metrics.ts',
    'src/lib/services/feedback.ts',
    'src/app/(dashboard)/settings/page.tsx',
    'src/components/layout/CookieConsent.tsx',
    'src/components/layout/Footer.tsx'
  ];

  const results = [];
  for (const file of criticalFiles) {
    const fullPath = path.join(rootDir, file);
    const exists = fs.existsSync(fullPath);
    results.push({ file, exists });
  }
  return results;
}

export function checkEnvTemplate() {
  const envPath = path.join(rootDir, '.env.example');
  if (!fs.existsSync(envPath)) {
    return { valid: false, missing: ['File .env.example not found'] };
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const requiredKeys = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATAFORSEO_API_LOGIN',
    'DATAFORSEO_API_PASSWORD',
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'NEXT_PUBLIC_APP_URL'
  ];

  const missing = requiredKeys.filter(key => !content.includes(key));
  return {
    valid: missing.length === 0,
    missing
  };
}

export function runPreflight() {
  console.log('==================================================');
  console.log('Topical Authority Creator — Pre-Flight Checklist');
  console.log('==================================================\n');

  const fileChecks = checkSystemFiles();
  const allFilesExist = fileChecks.every(f => f.exists);

  console.log('1. Critical System Files:');
  for (const f of fileChecks) {
    console.log(`   ${f.exists ? '✓' : '✗'} ${f.file}`);
  }

  console.log('\n2. Environment Contract (.env.example):');
  const envCheck = checkEnvTemplate();
  if (envCheck.valid) {
    console.log('   ✓ All 10 required environment variables documented.');
  } else {
    console.log(`   ✗ Missing keys: ${envCheck.missing.join(', ')}`);
  }

  const passed = allFilesExist && envCheck.valid;
  console.log('\n--------------------------------------------------');
  console.log(`Result: ${passed ? 'PRE-FLIGHT PASS (Ready for Beta Launch)' : 'PRE-FLIGHT FAILED'}`);
  console.log('--------------------------------------------------\n');

  return passed;
}

// If invoked directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ok = runPreflight();
  process.exit(ok ? 0 : 1);
}
