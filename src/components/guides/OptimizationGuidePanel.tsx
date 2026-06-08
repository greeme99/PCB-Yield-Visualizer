import { ArrowDownToLine, Gauge } from 'lucide-react';
import { formatLength } from '../../features/yield-calc/units';
import type { OptimizationGuide, OptimizationItem, PanelConfig } from '../../features/yield-calc/types';

interface Props {
  guide: OptimizationGuide;
  config: PanelConfig;
  onApply: (patch: Partial<PanelConfig>) => void;
}

function GuideAction({
  title,
  item,
  field,
  config,
  onApply
}: {
  title: string;
  item: OptimizationItem | null;
  field: 'partW' | 'partH';
  config: PanelConfig;
  onApply: Props['onApply'];
}) {
  if (!item) {
    return (
      <div className="guide-card">
        <div className="mini-label">{title}</div>
        <div className="muted mt-2">범위 외</div>
      </div>
    );
  }
  const sign = item.delta > 0 ? '+' : item.delta < 0 ? '-' : '';
  const deltaLabel = `${sign}${formatLength(Math.abs(item.delta), config.unit)}`;
  return (
    <div className="guide-card">
      <div className="mini-label">{title}</div>
      <button className="button guide-action" onClick={() => onApply({ [field]: item.value })}>
        <span>{formatLength(item.value, config.unit)} ({deltaLabel})</span>
        <ArrowDownToLine size={15} />
      </button>
      <div className="muted mt-2">예상 수량 {item.count} PCS</div>
    </div>
  );
}

export function OptimizationGuidePanel({ guide, config, onApply }: Props) {
  return (
    <section className="panel">
      <h2 className="section-title">
        <Gauge size={16} />
        최적화 사이즈 가이드
      </h2>
      <div className="guide-grid">
        <div className="guide-card full">
          <div className="mini-label">현재 제품 크기</div>
          <strong>{formatLength(config.partW, config.unit)} x {formatLength(config.partH, config.unit)}</strong>
        </div>
        <GuideAction title="가로 1줄 추가 가능" item={guide.widthAdd} field="partW" config={config} onApply={onApply} />
        <GuideAction title="가로 수량 한계" item={guide.widthLimit} field="partW" config={config} onApply={onApply} />
        <GuideAction title="세로 1줄 추가 가능" item={guide.heightAdd} field="partH" config={config} onApply={onApply} />
        <GuideAction title="세로 수량 한계" item={guide.heightLimit} field="partH" config={config} onApply={onApply} />
      </div>
    </section>
  );
}
