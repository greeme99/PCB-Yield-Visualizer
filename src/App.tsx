import { useEffect, useMemo, useRef } from 'react';
import { CanvasView } from './components/canvas/CanvasView';
import { Legend } from './components/common/Legend';
import { ConfigPanel } from './components/forms/ConfigPanel';
import { OptimizationGuidePanel } from './components/guides/OptimizationGuidePanel';
import { Header } from './components/layout/Header';
import { HistoryPresetPanel } from './components/results/HistoryPresetPanel';
import { ResultSummary } from './components/results/ResultSummary';
import { calculateOptimizationGuide, calculateYield } from './features/yield-calc/calculate';
import { validateConfig } from './features/validation/validate';
import { downloadCanvasPng } from './services/export/png';
import { useAppStore } from './stores/appStore';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {
    config,
    theme,
    placementMode,
    zoom,
    mousePoint,
    history,
    presets,
    setConfig,
    setTheme,
    setPlacementMode,
    setZoom,
    setMousePoint,
    resetConfig,
    addHistory,
    savePreset,
    applyConfig
  } = useAppStore();

  const result = useMemo(() => calculateYield(config), [config]);
  const guide = useMemo(() => calculateOptimizationGuide(config), [config]);
  const issues = useMemo(() => validateConfig(config), [config]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handle = window.setTimeout(() => addHistory(), 700);
    return () => window.clearTimeout(handle);
  }, [config, addHistory]);

  return (
    <div className="app-shell">
      <Header theme={theme} onThemeChange={setTheme} onExport={() => downloadCanvasPng(canvasRef.current)} />
      <main className="layout-grid">
        <aside className="sidebar">
          <ConfigPanel
            config={config}
            issues={issues}
            zoom={zoom}
            onChange={setConfig}
            onZoomChange={setZoom}
            onReset={resetConfig}
            onSavePreset={savePreset}
          />
          <ResultSummary config={config} result={result} />
          <OptimizationGuidePanel guide={guide} config={config} onApply={setConfig} />
          <HistoryPresetPanel history={history} presets={presets} onApply={applyConfig} />
          <Legend />
        </aside>
        <CanvasView
          config={config}
          result={result}
          zoom={zoom}
          placementMode={placementMode}
          mousePoint={mousePoint}
          onZoomChange={setZoom}
          onPlacementModeChange={setPlacementMode}
          onMousePointChange={setMousePoint}
          onCanvasReady={(canvas) => { canvasRef.current = canvas; }}
        />
      </main>
    </div>
  );
}
