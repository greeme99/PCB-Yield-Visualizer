import { Maximize2, Minus, Move, Plus, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { renderLayout } from './canvasRenderer';
import type { PanelConfig, PlacementMode, ThemeMode, YieldResult } from '../../features/yield-calc/types';

interface Props {
  config: PanelConfig;
  result: YieldResult;
  zoom: number;
  placementMode: PlacementMode;
  theme: ThemeMode;
  mousePoint: { x: number; y: number };
  onZoomChange: (zoom: number) => void;
  onPlacementModeChange: (mode: PlacementMode) => void;
  onMousePointChange: (point: { x: number; y: number }) => void;
  onCanvasReady: (canvas: HTMLCanvasElement | null) => void;
}

export function CanvasView(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, left: 0, top: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    renderLayout({ canvas: canvasRef.current, ...props });
    props.onCanvasReady(canvasRef.current);
  }, [props.config, props.result, props.zoom, props.placementMode, props.mousePoint]);

  const fitView = () => {
    props.onZoomChange(1);
    requestAnimationFrame(() => {
      if (!viewportRef.current) return;
      viewportRef.current.scrollLeft = (viewportRef.current.scrollWidth - viewportRef.current.clientWidth) / 2;
      viewportRef.current.scrollTop = 0;
    });
  };

  return (
    <section className="canvas-shell">
      <div className="canvas-toolbar">
        <div className="toolbar">
          <button className="icon-button" title="전체 보기" onClick={fitView}><Maximize2 size={16} /></button>
          <button className="icon-button" title="100% 보기" onClick={() => props.onZoomChange(1)}><RotateCcw size={16} /></button>
          <button className="icon-button" title="축소" onClick={() => props.onZoomChange(props.zoom - 0.1)}><Minus size={16} /></button>
          <button className="icon-button" title="확대" onClick={() => props.onZoomChange(props.zoom + 0.1)}><Plus size={16} /></button>
        </div>
        <div className="segmented">
          <button className={`button ${props.placementMode === 'auto' ? 'active' : ''}`} onClick={() => props.onPlacementModeChange('auto')}>자동</button>
          <button className={`button ${props.placementMode === 'manual' ? 'active' : ''}`} onClick={() => props.onPlacementModeChange('manual')}>
            <Move size={14} />
            수동
          </button>
        </div>
      </div>
      <div
        className="canvas-viewport"
        ref={viewportRef}
        onWheel={(event) => {
          event.preventDefault();
          props.onZoomChange(props.zoom + (event.deltaY < 0 ? 0.1 : -0.1));
        }}
        onMouseDown={(event) => {
          if (!viewportRef.current || event.button !== 0) return;
          setIsPanning(true);
          panStart.current = { x: event.clientX, y: event.clientY, left: viewportRef.current.scrollLeft, top: viewportRef.current.scrollTop };
        }}
        onMouseMove={(event) => {
          const canvas = canvasRef.current;
          const viewport = viewportRef.current;
          if (!canvas || !viewport) return;
          if (isPanning) {
            viewport.scrollLeft = panStart.current.left - (event.clientX - panStart.current.x);
            viewport.scrollTop = panStart.current.top - (event.clientY - panStart.current.y);
          }
          const rect = canvas.getBoundingClientRect();
          props.onMousePointChange({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }}
        onMouseUp={() => setIsPanning(false)}
        onMouseLeave={() => setIsPanning(false)}
      >
        <div className="canvas-inner">
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div className="statusbar">
        <span>Zoom {Math.round(props.zoom * 100)}%</span>
        <span>좌표 {Math.round(props.mousePoint.x)}, {Math.round(props.mousePoint.y)}</span>
        <span>{props.result.isRotated ? '90도 적용' : '정방향 적용'}</span>
      </div>
    </section>
  );
}
