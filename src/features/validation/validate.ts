import type { PanelConfig } from '../yield-calc/types';

export interface ValidationIssue {
  field: keyof PanelConfig | 'layout';
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export function validateConfig(config: PanelConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const positive = [
    ['panelW', '원판 W는 100mm 이상이어야 합니다.'],
    ['panelH', '원판 H는 100mm 이상이어야 합니다.'],
    ['partW', '제품 W는 10mm 이상이어야 합니다.'],
    ['partH', '제품 H는 10mm 이상이어야 합니다.']
  ] as const;

  positive.forEach(([field, message]) => {
    const min = field.startsWith('panel') ? 100 : 10;
    if (!Number.isFinite(config[field]) || config[field] < min) issues.push({ field, severity: 'error', message });
  });

  if (!Number.isFinite(config.borderLoss) || config.borderLoss < 0) {
    issues.push({ field: 'borderLoss', severity: 'error', message: '외곽 로스는 0 이상이어야 합니다.' });
  }
  if (!Number.isFinite(config.gap) || config.gap < 0) {
    issues.push({ field: 'gap', severity: 'error', message: '제품 간격은 0 이상이어야 합니다.' });
  }
  if (!Number.isFinite(config.manualCols) || config.manualCols < 0) {
    issues.push({ field: 'manualCols', severity: 'error', message: '수동 가로 수량은 0 이상이어야 합니다.' });
  }
  if (!Number.isFinite(config.manualRows) || config.manualRows < 0) {
    issues.push({ field: 'manualRows', severity: 'error', message: '수동 세로 수량은 0 이상이어야 합니다.' });
  }
  if (config.panelW - 2 * config.borderLoss <= 0 || config.panelH - 2 * config.borderLoss <= 0) {
    issues.push({ field: 'layout', severity: 'error', message: '외곽 로스가 너무 커서 유효 작업영역이 없습니다.' });
  }
  if (config.partW > config.panelW || config.partH > config.panelH) {
    issues.push({ field: 'layout', severity: 'warning', message: '제품 크기가 원판보다 큽니다. 회전 또는 치수 조정을 확인하세요.' });
  }
  return issues;
}

export function hasBlockingIssue(issues: ValidationIssue[]) {
  return issues.some((issue) => issue.severity === 'error');
}
