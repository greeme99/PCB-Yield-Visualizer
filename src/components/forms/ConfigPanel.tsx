import { RotateCcw, Save } from 'lucide-react';
import type { PanelConfig } from '../../features/yield-calc/types';
import type { ValidationIssue } from '../../features/validation/validate';

interface ConfigPanelProps {
  config: PanelConfig;
  issues: ValidationIssue[];
  zoom: number;
  onChange: (patch: Partial<PanelConfig>) => void;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
  onSavePreset: (name: string) => void;
}

function NumberField({ label, value, onChange, min = 0 }: { label: string; value: number; min?: number; onChange: (value: number) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" type="number" min={min} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

export function ConfigPanel({ config, issues, zoom, onChange, onZoomChange, onReset, onSavePreset }: ConfigPanelProps) {
  return (
    <section className="panel">
      <h2 className="section-title">규격 설정</h2>
      <div className="form-grid">
        <div className="field full">
          <label>원판 규격</label>
          <select className="select" value={config.panelPreset} onChange={(event) => onChange({ panelPreset: event.target.value as PanelConfig['panelPreset'] })}>
            <option value="1000x1000">1000 x 1000 (레귤러)</option>
            <option value="1200x1000">1200 x 1000 (점보)</option>
            <option value="custom">직접 입력</option>
          </select>
        </div>
        {config.panelPreset === 'custom' && (
          <>
            <NumberField label="원판 W (mm)" min={100} value={config.panelW} onChange={(panelW) => onChange({ panelW })} />
            <NumberField label="원판 H (mm)" min={100} value={config.panelH} onChange={(panelH) => onChange({ panelH })} />
          </>
        )}
        <NumberField label="제품 W (mm)" min={10} value={config.partW} onChange={(partW) => onChange({ partW })} />
        <NumberField label="제품 H (mm)" min={10} value={config.partH} onChange={(partH) => onChange({ partH })} />
        <NumberField label="외곽 로스 (mm)" value={config.borderLoss} onChange={(borderLoss) => onChange({ borderLoss })} />
        <NumberField label="제품 GAP (mm)" value={config.gap} onChange={(gap) => onChange({ gap })} />
        <div className="field">
          <label>회전 옵션</label>
          <select className="select" value={config.rotateMode} onChange={(event) => onChange({ rotateMode: event.target.value as PanelConfig['rotateMode'] })}>
            <option value="auto">최적 수량 (자동)</option>
            <option value="0">정방향 고정</option>
            <option value="90">90도 회전 고정</option>
          </select>
        </div>
        <div className="field">
          <label>단위</label>
          <select className="select" value={config.unit} onChange={(event) => onChange({ unit: event.target.value as PanelConfig['unit'] })}>
            <option value="mm">mm</option>
            <option value="inch">inch (표시 확장 예정)</option>
          </select>
        </div>
        <div className="field full">
          <label>배율 {Math.round(zoom * 100)}%</label>
          <input className="input" type="range" min={50} max={300} step={10} value={zoom * 100} onChange={(event) => onZoomChange(Number(event.target.value) / 100)} />
        </div>
      </div>

      {issues.length > 0 && (
        <div className="mt-3 grid gap-2">
          {issues.map((issue) => (
            <div className="message" key={`${issue.field}-${issue.message}`}>{issue.message}</div>
          ))}
        </div>
      )}

      <details className="mt-3">
        <summary className="mini-label">고급 공정 옵션</summary>
        <div className="placeholder mt-2 muted">비대칭 여백, 툴링홀, V-cut, 금지구역 확장을 위한 진입 구조가 준비되어 있습니다.</div>
      </details>

      <div className="toolbar mt-3">
        <button className="button" onClick={() => onSavePreset(window.prompt('프리셋 이름을 입력하세요') ?? '')}>
          <Save size={15} />
          프리셋 저장
        </button>
        <button className="button" onClick={onReset}>
          <RotateCcw size={15} />
          초기화
        </button>
      </div>
    </section>
  );
}
