import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { rotateLabel } from '../../features/yield-calc/calculate';
import { formatLength } from '../../features/yield-calc/units';
import type { PanelConfig, YieldResult } from '../../features/yield-calc/types';

interface ResultSummaryProps {
  config: PanelConfig;
  result: YieldResult;
}

const statusCopy = {
  ok: { label: '정상 계산', icon: CheckCircle2 },
  warning: { label: '주의 필요', icon: AlertTriangle },
  impossible: { label: '배치 불가', icon: XCircle }
};

export function ResultSummary({ config, result }: ResultSummaryProps) {
  const StatusIcon = statusCopy[result.status].icon;
  const hasOverflow = result.overflowW > 0 || result.overflowH > 0;
  return (
    <section className="panel">
      <h2 className="section-title">분석 결과</h2>
      <div className={`status-badge status-${result.status}`}>
        <StatusIcon size={15} />
        {statusCopy[result.status].label}
      </div>
      <div className="result-grid mt-3">
        <div className="result-card">
          <div className="result-label">총 수량</div>
          <div className="result-value" style={{ color: 'var(--success)' }}>{result.fit.count} PCS</div>
        </div>
        <div className="result-card">
          <div className="result-label">단순 수율</div>
          <div className="result-value">{result.efficiency.toFixed(1)}%</div>
        </div>
        <div className="result-card">
          <div className="result-label">실공정 수율</div>
          <div className="result-value">{result.processEfficiency.toFixed(1)}%</div>
        </div>
        <div className="result-card">
          <div className="result-label">배열</div>
          <div className="result-value">{result.fit.cols} x {result.fit.rows}</div>
        </div>
        <div className="result-card full">
          <div className="result-label">{hasOverflow ? '초과 가로/세로' : '남은 가로/세로'}</div>
          <div className="result-value">
            {hasOverflow
              ? `${formatLength(result.overflowW, config.unit)} / ${formatLength(result.overflowH, config.unit)}`
              : `${formatLength(result.remainingW, config.unit)} / ${formatLength(result.remainingH, config.unit)}`}
          </div>
        </div>
      </div>
      <div className="placeholder mt-3 muted">
        {rotateLabel(config.rotateMode, result.isRotated)} · 유효영역 {formatLength(result.effectiveW, config.unit)} x {formatLength(result.effectiveH, config.unit)}
        {hasOverflow ? ' · 수동 배열이 유효영역을 초과합니다' : ''}
      </div>
    </section>
  );
}
