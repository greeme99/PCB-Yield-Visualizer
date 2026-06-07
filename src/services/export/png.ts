export function downloadCanvasPng(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = 'PCB_Layout.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
