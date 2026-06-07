import type { PanelConfig } from '../../features/yield-calc/types';
import type { SavedPreset, SavedRun } from '../../features/persistence/storage';

interface Props {
  history: SavedRun[];
  presets: SavedPreset[];
  onApply: (config: PanelConfig) => void;
}

export function HistoryPresetPanel({ history, presets, onApply }: Props) {
  return (
    <section className="panel">
      <h2 className="section-title">최근 이력 / 프리셋</h2>
      <div className="history-list">
        {presets.length === 0 && history.length === 0 && (
          <div className="placeholder muted">조건 변경 시 최근 계산 이력이 쌓이고, 저장한 프리셋은 여기에서 즉시 재적용할 수 있습니다.</div>
        )}
        {presets.map((preset) => (
          <button className="history-row" key={preset.id} onClick={() => onApply(preset.config)}>
            <strong>{preset.name}</strong>
            <div className="muted">{preset.config.panelW}x{preset.config.panelH} · {preset.config.partW}x{preset.config.partH}mm</div>
          </button>
        ))}
        {history.map((item) => (
          <button className="history-row" key={item.id} onClick={() => onApply(item.config)}>
            <strong>{item.count} PCS · {item.efficiency.toFixed(1)}%</strong>
            <div className="muted">{new Date(item.createdAt).toLocaleTimeString()} · {item.config.partW}x{item.config.partH}mm</div>
          </button>
        ))}
      </div>
    </section>
  );
}
