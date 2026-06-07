import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG } from '../src/features/yield-calc/calculate';
import { hasBlockingIssue, validateConfig } from '../src/features/validation/validate';

describe('validateConfig', () => {
  it('accepts the default engineering setup', () => {
    const issues = validateConfig(DEFAULT_CONFIG);
    expect(hasBlockingIssue(issues)).toBe(false);
  });

  it('flags invalid numeric ranges', () => {
    const issues = validateConfig({ ...DEFAULT_CONFIG, partW: 2, gap: -1 });

    expect(issues.map((issue) => issue.field)).toContain('partW');
    expect(issues.map((issue) => issue.field)).toContain('gap');
    expect(hasBlockingIssue(issues)).toBe(true);
  });
});
