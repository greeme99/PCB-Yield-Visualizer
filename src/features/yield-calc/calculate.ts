import type { OptimizationGuide, PanelConfig, RotateMode, YieldResult } from './types';

export const DEFAULT_CONFIG: PanelConfig = {
  panelPreset: '1000x1000',
  panelW: 1000,
  panelH: 1000,
  partW: 245,
  partH: 245,
  borderLoss: 5,
  gap: 2,
  rotateMode: 'auto',
  unit: 'mm'
};

function fitOne(effectiveW: number, effectiveH: number, partW: number, partH: number, gap: number) {
  const cols = Math.max(0, Math.floor((effectiveW + gap) / (partW + gap)));
  const rows = Math.max(0, Math.floor((effectiveH + gap) / (partH + gap)));
  return { cols, rows, count: cols * rows, partW, partH };
}

export function calculateYield(config: PanelConfig): YieldResult {
  const { panelW, panelH, partW, partH, borderLoss, gap, rotateMode } = config;
  const effectiveW = Math.max(0, panelW - 2 * borderLoss);
  const effectiveH = Math.max(0, panelH - 2 * borderLoss);
  const normal = fitOne(effectiveW, effectiveH, partW, partH, gap);
  const rotated = fitOne(effectiveW, effectiveH, partH, partW, gap);

  let fit = normal;
  let isRotated = false;
  if (rotateMode === '90' || (rotateMode === 'auto' && rotated.count > normal.count)) {
    fit = rotated;
    isRotated = true;
  }

  const usedW = fit.cols > 0 ? fit.cols * fit.partW + (fit.cols - 1) * gap : 0;
  const usedH = fit.rows > 0 ? fit.rows * fit.partH + (fit.rows - 1) * gap : 0;
  const remainingW = Math.max(0, effectiveW - usedW);
  const remainingH = Math.max(0, effectiveH - usedH);
  const efficiency = panelW > 0 && panelH > 0 ? (fit.count * partW * partH) / (panelW * panelH) * 100 : 0;
  const processEfficiency = effectiveW > 0 && effectiveH > 0
    ? (fit.count * partW * partH) / (effectiveW * effectiveH) * 100
    : 0;

  const status = fit.count === 0 || effectiveW <= 0 || effectiveH <= 0 ? 'impossible' : efficiency > 90 ? 'warning' : 'ok';
  return {
    fit,
    usedW,
    usedH,
    remainingW,
    remainingH,
    effectiveW,
    effectiveH,
    efficiency,
    processEfficiency,
    isRotated,
    status
  };
}

export function calculateOptimizationGuide(config: PanelConfig, searchRange = 100): OptimizationGuide {
  const baseCount = calculateYield(config).fit.count;
  const find = (field: 'partW' | 'partH', direction: -1 | 1) => {
    for (let delta = 1; delta <= searchRange; delta += 1) {
      const nextValue = config[field] + delta * direction;
      if (nextValue < 10) continue;
      const result = calculateYield({ ...config, [field]: nextValue });
      if (direction === -1 && result.fit.count > baseCount) {
        return { value: nextValue, delta: -delta, count: result.fit.count };
      }
      if (direction === 1 && result.fit.count < baseCount) {
        const safeValue = config[field] + delta - 1;
        return { value: safeValue, delta: delta - 1, count: baseCount };
      }
    }
    return null;
  };

  return {
    widthAdd: find('partW', -1),
    widthLimit: find('partW', 1),
    heightAdd: find('partH', -1),
    heightLimit: find('partH', 1)
  };
}

export function presetToPanel(preset: PanelConfig['panelPreset']) {
  if (preset === '1000x1000') return { panelW: 1000, panelH: 1000 };
  if (preset === '1200x1000') return { panelW: 1200, panelH: 1000 };
  return null;
}

export function rotateLabel(mode: RotateMode, isRotated: boolean) {
  if (mode === 'auto') return isRotated ? '자동: 90도 선택' : '자동: 정방향 선택';
  return mode === '90' ? '90도 고정' : '정방향 고정';
}
