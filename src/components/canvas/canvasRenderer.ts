import type { PanelConfig, PlacementMode, ThemeMode, YieldResult } from '../../features/yield-calc/types';

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  config: PanelConfig;
  result: YieldResult;
  zoom: number;
  placementMode: PlacementMode;
  mousePoint: { x: number; y: number };
  theme: ThemeMode;
}

function drawDimension(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  distance: number,
  label: string,
  color = '#64748b',
  vertical = false,
  labelBackground = 'rgba(255,255,255,0.92)'
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  ctx.font = '700 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const perp = angle - Math.PI / 2;
  const lx1 = x1 + Math.cos(perp) * distance;
  const ly1 = y1 + Math.sin(perp) * distance;
  const lx2 = x2 + Math.cos(perp) * distance;
  const ly2 = y2 + Math.sin(perp) * distance;

  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(lx1, ly1);
  ctx.moveTo(x2, y2);
  ctx.lineTo(lx2, ly2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(lx1, ly1);
  ctx.lineTo(lx2, ly2);
  ctx.stroke();

  const mx = (lx1 + lx2) / 2;
  const my = (ly1 + ly2) / 2;
  const width = ctx.measureText(label).width + 14;
  ctx.save();
  ctx.translate(mx, my);
  if (vertical) ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = labelBackground;
  ctx.fillRect(-width / 2, -11, width, 22);
  ctx.strokeStyle = 'rgba(148,163,184,0.35)';
  ctx.strokeRect(-width / 2, -11, width, 22);
  ctx.fillStyle = color;
  ctx.fillText(label, 0, 0);
  ctx.restore();
  ctx.restore();
}

function drawArrowDimension(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label: string,
  color: string,
  vertical = false
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.8;
  ctx.font = '800 15px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 5;
  const drawHead = (x: number, y: number, a: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - head * Math.cos(a - Math.PI / 6), y - head * Math.sin(a - Math.PI / 6));
    ctx.lineTo(x - head * Math.cos(a + Math.PI / 6), y - head * Math.sin(a + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };
  drawHead(x1, y1, angle + Math.PI);
  drawHead(x2, y2, angle);

  ctx.save();
  ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
  if (vertical) ctx.rotate(-Math.PI / 2);
  const width = ctx.measureText(label).width + 18;
  ctx.fillStyle = '#000';
  ctx.fillRect(-width / 2, -13, width, 26);
  ctx.fillStyle = color;
  ctx.fillText(label, 0, 0);
  ctx.restore();
  ctx.restore();
}

function drawDottedGuide(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  label: string,
  color: string,
  verticalLabel = false
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([2, 5]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = '800 15px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.save();
  ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
  if (verticalLabel) ctx.rotate(-Math.PI / 2);
  ctx.fillText(label, 0, -12);
  ctx.restore();
  ctx.restore();
}

export function renderLayout({ canvas, config, result, zoom, placementMode, mousePoint, theme }: RenderOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const padding = 240;
  const viewportBase = 880;
  const scale = Math.max(0.12, Math.min((viewportBase - padding) / config.panelW, (760 - padding) / config.panelH)) * zoom;
  const cssW = config.panelW * scale + padding;
  const cssH = config.panelH * scale + padding;
  canvas.width = Math.ceil(cssW * dpr);
  canvas.height = Math.ceil(cssH * dpr);
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const px = padding / 2;
  const py = padding / 2;
  const panelW = config.panelW * scale;
  const panelH = config.panelH * scale;
  const isDark = theme === 'dark';
  const labelBackground = isDark ? '#000' : 'rgba(255,255,255,0.92)';
  ctx.fillStyle = isDark ? '#000' : '#f8fafc';
  ctx.fillRect(0, 0, cssW, cssH);
  ctx.fillStyle = isDark ? '#000' : '#e8eef8';
  ctx.fillRect(px, py, panelW, panelH);
  ctx.strokeStyle = isDark ? '#cbd5e1' : '#334155';
  ctx.lineWidth = 2;
  if (isDark) ctx.setLineDash([3, 5]);
  ctx.strokeRect(px, py, panelW, panelH);
  ctx.setLineDash([]);

  const loss = config.borderLoss * scale;
  if (config.borderLoss > 0 && !isDark) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.32)';
    ctx.fillRect(px, py, panelW, loss);
    ctx.fillRect(px, py + panelH - loss, panelW, loss);
    ctx.fillRect(px, py + loss, loss, Math.max(0, panelH - 2 * loss));
    ctx.fillRect(px + panelW - loss, py + loss, loss, Math.max(0, panelH - 2 * loss));
  }

  const ux = px + loss;
  const uy = py + loss;
  if (isDark) {
    drawArrowDimension(ctx, px, py - 48, px + panelW, py - 48, `${config.panelW}`, '#e5e7eb');
    drawArrowDimension(ctx, px - 78, py, px - 78, py + panelH, `${config.panelH}`, '#e5e7eb', true);
    if (config.borderLoss > 0) {
      drawDottedGuide(ctx, px, uy, ux, uy, `${config.borderLoss}`, '#ff2f2f');
      drawDottedGuide(ctx, px + panelW - loss, uy, px + panelW, uy, `${config.borderLoss}`, '#ff2f2f');
      drawDottedGuide(ctx, ux, py, ux, uy, `${config.borderLoss}`, '#ff2f2f', true);
      drawDottedGuide(ctx, px + panelW, uy, px + panelW, py + loss, `${config.borderLoss}`, '#ff2f2f', true);
      drawDottedGuide(ctx, ux, py + panelH - loss, ux, py + panelH, `${config.borderLoss}`, '#ff2f2f', true);
    }
  } else {
    drawDimension(ctx, px, py, px + panelW, py, 72, `${config.panelW}mm`, '#334155');
    drawDimension(ctx, px, py, px, py + panelH, -84, `${config.panelH}mm`, '#334155', true);
  }

  if (placementMode === 'auto') {
    ctx.fillStyle = isDark ? 'rgba(18, 113, 88, 0.95)' : 'rgba(37, 99, 235, 0.78)';
    ctx.strokeStyle = isDark ? 'rgba(45, 179, 145, 0.95)' : 'rgba(30, 64, 175, 0.9)';
    for (let row = 0; row < result.fit.rows; row += 1) {
      for (let col = 0; col < result.fit.cols; col += 1) {
        const x = ux + col * (result.fit.partW + config.gap) * scale;
        const y = uy + row * (result.fit.partH + config.gap) * scale;
        ctx.fillRect(x, y, result.fit.partW * scale, result.fit.partH * scale);
        ctx.strokeRect(x, y, result.fit.partW * scale, result.fit.partH * scale);
      }
    }
  } else {
    const mX = (mousePoint.x - ux) / scale;
    const mY = (mousePoint.y - uy) / scale;
    const ok = mX >= 0 && mY >= 0 && mX + result.fit.partW <= result.effectiveW && mY + result.fit.partH <= result.effectiveH;
    ctx.fillStyle = ok ? 'rgba(22, 163, 74, 0.72)' : 'rgba(220, 38, 38, 0.72)';
    ctx.strokeStyle = ok ? '#15803d' : '#b91c1c';
    ctx.fillRect(mousePoint.x, mousePoint.y, result.fit.partW * scale, result.fit.partH * scale);
    ctx.strokeRect(mousePoint.x, mousePoint.y, result.fit.partW * scale, result.fit.partH * scale);
  }

  if (result.fit.count > 0) {
    drawDimension(ctx, ux, uy + result.fit.partH * scale, ux + result.fit.partW * scale, uy + result.fit.partH * scale, 34, `${result.fit.partW}`, '#004cff', false, labelBackground);
    drawDimension(ctx, ux + result.fit.partW * scale, uy, ux + result.fit.partW * scale, uy + result.fit.partH * scale, 40, `${result.fit.partH}`, '#004cff', true, labelBackground);
    if (config.gap > 0 && result.fit.cols > 1) {
      drawDimension(ctx, ux + result.fit.partW * scale, py, ux + (result.fit.partW + config.gap) * scale, py, 44, `${config.gap}`, '#a855f7', false, labelBackground);
      if (isDark) {
        drawDottedGuide(ctx, ux + result.fit.partW * scale, uy, ux + (result.fit.partW + config.gap) * scale, uy, `${config.gap}`, '#a855f7');
        drawDottedGuide(ctx, ux, uy + result.fit.partH * scale, ux, uy + (result.fit.partH + config.gap) * scale, `${config.gap}`, '#a855f7', true);
      }
    }
    if (result.remainingW > 0.1) {
      if (isDark) {
        drawDottedGuide(ctx, ux + result.usedW * scale, py + panelH, px + panelW - loss, py + panelH, `${Math.round(result.remainingW)}`, '#f59e0b');
      } else {
        drawDimension(ctx, ux + result.usedW * scale, py + panelH, px + panelW - loss, py + panelH, -48, `${Math.round(result.remainingW)}mm`, '#b45309');
      }
    }
    if (result.remainingH > 0.1) {
      if (isDark) {
        drawDottedGuide(ctx, px + panelW - loss, uy + result.usedH * scale, px + panelW - loss, py + panelH - loss, `${Math.round(result.remainingH)}`, '#f59e0b', true);
      } else {
        drawDimension(ctx, px + panelW, uy + result.usedH * scale, px + panelW, py + panelH - loss, 48, `${Math.round(result.remainingH)}mm`, '#b45309', true);
      }
    }
  }
}
