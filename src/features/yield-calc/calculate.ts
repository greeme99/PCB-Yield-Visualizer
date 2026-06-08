import type { OptimizationGuide, PanelConfig, PlacementMode, RotateMode, YieldResult } from './types';

export const DEFAULT_CONFIG: PanelConfig = {
  panelPreset: '1000x1000',
  panelW: 1000,
  panelH: 1000,
  partW: 245,
  partH: 245,
  borderLoss: 5,
  gap: 2,
  manualCols: 4,
  manualRows: 4,
  rotateMode: 'auto',
  unit: 'mm'
};

function fitOne(effectiveW: number, effectiveH: number, partW: number, partH: number, gap: number) {
  const cols = Math.max(0, Math.floor((effectiveW + gap) / (partW + gap)));
  const rows = Math.max(0, Math.floor((effectiveH + gap) / (partH + gap)));
  return { cols, rows, count: cols * rows, partW, partH };
}

function manualFit(cols: number, rows: number, partW: number, partH: number) {
  const safeCols = Math.max(0, Math.floor(cols));
  const safeRows = Math.max(0, Math.floor(rows));
  return { cols: safeCols, rows: safeRows, count: safeCols * safeRows, partW, partH };
}

function chooseAutoFit(config: PanelConfig, effectiveW: number, effectiveH: number) {
  const normal = fitOne(effectiveW, effectiveH, config.partW, config.partH, config.gap);
  const rotated = fitOne(effectiveW, effectiveH, config.partH, config.partW, config.gap);
  if (config.rotateMode === '90' || (config.rotateMode === 'auto' && rotated.count > normal.count)) {
    return { fit: rotated, isRotated: true };
  }
  return { fit: normal, isRotated: false };
}

function chooseManualFit(config: PanelConfig, effectiveW: number, effectiveH: number) {
  const normal = manualFit(config.manualCols, config.manualRows, config.partW, config.partH);
  const rotated = manualFit(config.manualCols, config.manualRows, config.partH, config.partW);
  if (config.rotateMode === '90') return { fit: rotated, isRotated: true };
  if (config.rotateMode === '0') return { fit: normal, isRotated: false };

  const normalUsedW = usedLength(normal.cols, normal.partW, config.gap);
  const normalUsedH = usedLength(normal.rows, normal.partH, config.gap);
  const rotatedUsedW = usedLength(rotated.cols, rotated.partW, config.gap);
  const rotatedUsedH = usedLength(rotated.rows, rotated.partH, config.gap);
  const normalOverflow = Math.max(0, normalUsedW - effectiveW) + Math.max(0, normalUsedH - effectiveH);
  const rotatedOverflow = Math.max(0, rotatedUsedW - effectiveW) + Math.max(0, rotatedUsedH - effectiveH);
  return rotatedOverflow < normalOverflow ? { fit: rotated, isRotated: true } : { fit: normal, isRotated: false };
}

function usedLength(count: number, partLength: number, gap: number) {
  return count > 0 ? count * partLength + (count - 1) * gap : 0;
}

export function calculateYield(config: PanelConfig, placementMode: PlacementMode = 'auto'): YieldResult {
  const { panelW, panelH, partW, partH, borderLoss, gap } = config;
  const effectiveW = Math.max(0, panelW - 2 * borderLoss);
  const effectiveH = Math.max(0, panelH - 2 * borderLoss);
  const { fit, isRotated } = placementMode === 'manual'
    ? chooseManualFit(config, effectiveW, effectiveH)
    : chooseAutoFit(config, effectiveW, effectiveH);

  const usedW = usedLength(fit.cols, fit.partW, gap);
  const usedH = usedLength(fit.rows, fit.partH, gap);
  const remainingW = Math.max(0, effectiveW - usedW);
  const remainingH = Math.max(0, effectiveH - usedH);
  const overflowW = Math.max(0, usedW - effectiveW);
  const overflowH = Math.max(0, usedH - effectiveH);
  const efficiency = panelW > 0 && panelH > 0 ? (fit.count * partW * partH) / (panelW * panelH) * 100 : 0;
  const processEfficiency = effectiveW > 0 && effectiveH > 0
    ? (fit.count * partW * partH) / (effectiveW * effectiveH) * 100
    : 0;

  const status = fit.count === 0 || effectiveW <= 0 || effectiveH <= 0 || overflowW > 0 || overflowH > 0
    ? 'impossible'
    : efficiency > 90 ? 'warning' : 'ok';
  return {
    fit,
    usedW,
    usedH,
    remainingW,
    remainingH,
    overflowW,
    overflowH,
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
