// CSS for .cube-tile and @keyframes cubePulse is in /style.css
// Do NOT add inline <style> tags here - they render in <body> and cause flash

export const HeroCubeGrid = () => {
  const tileSize = 80;
  const gap = 4;
  const cellSize = tileSize + gap;
  const cols = Math.ceil(2048 / cellSize);
  const rows = Math.ceil(826 / cellSize);

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
      tiles.push({ col, row, delay: normalizedDistance * 2 });
    }
  }

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      viewBox="0 0 2048 826"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#FAFAFA" />

      {tiles.map((tile, i) => {
        const x = tile.col * cellSize;
        const y = tile.row * cellSize;

        return (
          <g key={i} className="cube-tile" style={{
            animation: `cubePulse 3s ease-in-out infinite`,
            animationDelay: `${tile.delay}s`,
          }}>
            <rect
              x={x + gap / 2}
              y={y + gap / 2}
              width={tileSize}
              height={tileSize}
              fill="#cccccc"
              fillOpacity={0.3}
            />
            <rect
              x={x + gap / 2}
              y={y + gap / 2}
              width={tileSize}
              height={tileSize}
              fill="none"
              stroke="#0066ff"
              strokeWidth={1.5}
              strokeOpacity={0.4}
            />
          </g>
        );
      })}
    </svg>
  );
};
