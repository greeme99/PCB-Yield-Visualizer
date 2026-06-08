import { describe, expect, it } from 'vitest';
import { calculateOptimizationGuide, calculateYield, DEFAULT_CONFIG } from '../src/features/yield-calc/calculate';

describe('calculateYield', () => {
  it('preserves the legacy default calculation', () => {
    const result = calculateYield(DEFAULT_CONFIG);

    expect(result.fit.cols).toBe(4);
    expect(result.fit.rows).toBe(4);
    expect(result.fit.count).toBe(16);
    expect(result.efficiency).toBeCloseTo(96.0, 1);
    expect(result.remainingW).toBe(4);
    expect(result.remainingH).toBe(4);
  });

  it('chooses the better orientation in auto rotate mode', () => {
    const result = calculateYield({ ...DEFAULT_CONFIG, panelW: 1200, panelH: 1000, partW: 330, partH: 240 });

    expect(result.fit.count).toBe(12);
    expect(result.isRotated).toBe(false);
  });

  it('returns impossible when border loss consumes the panel', () => {
    const result = calculateYield({ ...DEFAULT_CONFIG, borderLoss: 600 });

    expect(result.status).toBe('impossible');
    expect(result.fit.count).toBe(0);
  });

  it('uses fixed columns and rows in manual placement mode', () => {
    const result = calculateYield({ ...DEFAULT_CONFIG, manualCols: 3, manualRows: 2 }, 'manual');

    expect(result.fit.cols).toBe(3);
    expect(result.fit.rows).toBe(2);
    expect(result.fit.count).toBe(6);
    expect(result.remainingW).toBe(251);
    expect(result.remainingH).toBe(498);
  });

  it('marks manual placement impossible when the fixed array exceeds the effective area', () => {
    const result = calculateYield({ ...DEFAULT_CONFIG, manualCols: 5, manualRows: 4 }, 'manual');

    expect(result.status).toBe('impossible');
    expect(result.fit.count).toBe(20);
    expect(result.overflowW).toBe(243);
  });
});

describe('calculateOptimizationGuide', () => {
  it('finds actionable width and height suggestions within 100mm', () => {
    const guide = calculateOptimizationGuide(DEFAULT_CONFIG);

    expect(guide.widthAdd?.value).toBe(196);
    expect(guide.heightAdd?.value).toBe(196);
    expect(guide.widthLimit?.value).toBe(246);
    expect(guide.heightLimit?.value).toBe(246);
  });
});
