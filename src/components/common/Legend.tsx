export function Legend() {
  const items = [
    ['#e8eef8', '원판 규격'],
    ['#2563eb', 'PCB 사이즈'],
    ['rgba(239,68,68,0.45)', '외곽 로스'],
    ['#7c3aed', '제품 GAP'],
    ['#b45309', '남는 영역']
  ];
  return (
    <section className="panel">
      <h2 className="section-title">범례</h2>
      <div className="legend-grid">
        {items.map(([color, label]) => (
          <div className="legend-item" key={label}>
            <span className="swatch" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
