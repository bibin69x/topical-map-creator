import { describe, it, expect } from 'vitest';
import { checkSystemFiles, checkEnvTemplate } from '../../../scripts/preflight.mjs';

describe('Phase 17: Pre-Flight Automated Validation Suite (TEST-16)', () => {
  it('confirms all critical system files exist and are accessible', () => {
    const fileChecks = checkSystemFiles();
    expect(fileChecks.length).toBeGreaterThanOrEqual(10);

    for (const check of fileChecks) {
      expect(check.exists, `File missing: ${check.file}`).toBe(true);
    }
  });

  it('validates .env.example contract completeness', () => {
    const envCheck = checkEnvTemplate();
    expect(envCheck.valid).toBe(true);
    expect(envCheck.missing.length).toBe(0);
  });
});
