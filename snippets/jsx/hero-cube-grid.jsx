// Styles in style.css - animation uses CSS class .cube-tile

export const HeroCubeGrid = () => {
  const tileSize = 72;
  const gap = 6;
  const cellSize = tileSize + gap;
  const cols = Math.ceil(2048 / cellSize);
  const rows = Math.ceil(700 / cellSize);

  const centerX = (cols - 1) / 2;
  const centerY = (rows - 1) / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

  const tiles = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const dx = col - centerX;
      const dy = row - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDistance = distance / maxDistance;
      tiles.push({ col, row, delay: normalizedDistance * 2.5 });
    }
  }

  return (
    <div className="hero-cube-grid">
      <svg
        viewBox="0 0 2048 700"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#gridGradient)" />

        {tiles.map((tile, i) => {
          const x = tile.col * cellSize;
          const y = tile.row * cellSize;

          return (
            <g key={i} className="cube-tile" style={{ animationDelay: `${tile.delay}s` }}>
              <rect
                x={x + gap / 2}
                y={y + gap / 2}
                width={tileSize}
                height={tileSize}
                fill="#e2e8f0"
                fillOpacity={0.5}
                rx={4}
              />
              <rect
                x={x + gap / 2}
                y={y + gap / 2}
                width={tileSize}
                height={tileSize}
                fill="none"
                stroke="#0066ff"
                strokeWidth={1.5}
                strokeOpacity={0.25}
                rx={4}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
