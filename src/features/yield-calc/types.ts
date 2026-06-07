export type PanelPreset = '1000x1000' | '1200x1000' | 'custom';
export type RotateMode = 'auto' | '0' | '90';
export type ThemeMode = 'light' | 'dark' | 'blueGray';
export type PlacementMode = 'auto' | 'manual';
export type UnitMode = 'mm' | 'inch';

export interface PanelConfig {
  panelPreset: PanelPreset;
  panelW: number;
  panelH: number;
  partW: number;
  partH: number;
  borderLoss: number;
  gap: number;
  rotateMode: RotateMode;
  unit: UnitMode;
}

export interface FitResult {
  cols: number;
  rows: number;
  count: number;
  partW: number;
  partH: number;
}

export interface YieldResult {
  fit: FitResult;
  usedW: number;
  usedH: number;
  remainingW: number;
  remainingH: number;
  effectiveW: number;
  effectiveH: number;
  efficiency: number;
  processEfficiency: number;
  isRotated: boolean;
  status: 'ok' | 'warning' | 'impossible';
}

export interface OptimizationItem {
  value: number;
  delta: number;
  count: number;
}

export interface OptimizationGuide {
  widthAdd: OptimizationItem | null;
  widthLimit: OptimizationItem | null;
  heightAdd: OptimizationItem | null;
  heightLimit: OptimizationItem | null;
}
