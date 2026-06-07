import { ArrowDownToLine, Gauge } from 'lucide-react';
import type { OptimizationGuide, OptimizationItem, PanelConfig } from '../../features/yield-calc/types';

interface Props {
  guide: OptimizationGuide;
  config: PanelConfig;
  onApply: (patch: Partial<PanelConfig>) => void;
}

function GuideAction({ title, item, field, onApply }: { title: string; item: OptimizationItem | null; field: 'partW' | 'partH'; onApply: Props['onApply'] }) {
  if (!item) {
    return (
      <div className="guide-card">
        <div className="mini-label">{title}</div>
        <div className="muted mt-2">범위 외</div>
      </div>
    );
  }
  const sign = item.delta > 0 ? '+' : '';
  return (
    <div className="guide-card">
      <div className="mini-label">{title}</div>
      <button className="button guide-action" onClick={() => onApply({ [field]: item.value })}>
        <span>{item.value}mm ({sign}{item.delta}mm)</span>
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
          <strong>{config.partW} x {config.partH}mm</strong>
        </div>
        <GuideAction title="가로 1줄 추가 가능" item={guide.widthAdd} field="partW" onApply={onApply} />
        <GuideAction title="가로 수량 한계" item={guide.widthLimit} field="partW" onApply={onApply} />
        <GuideAction title="세로 1줄 추가 가능" item={guide.heightAdd} field="partH" onApply={onApply} />
        <GuideAction title="세로 수량 한계" item={guide.heightLimit} field="partH" onApply={onApply} />
      </div>
    </section>
  );
}
