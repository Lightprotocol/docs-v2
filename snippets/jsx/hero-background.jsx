export const HeroBackground = () => {
  const cellSize = 91;
  const cols = 23; // 2048 / 91 ≈ 22.5
  const rows = 10; // 826 / 91 ≈ 9

  // Tinted tiles configuration
  const tiles = [
    { col: 4, row: 1, w: 2, h: 2, opacity: 0.05 },
    { col: 9, row: 2, w: 2, h: 2, opacity: 0.05 },
    { col: 12, row: 3, w: 1, h: 2, opacity: 0.05 },
    { col: 15, row: 2, w: 2, h: 2, opacity: 0.05 },
    { col: 18, row: 4, w: 1, h: 2, opacity: 0.04 },
    { col: 6, row: 4, w: 4, h: 3, opacity: 0.03 },
    { col: 10, row: 4, w: 3, h: 3, opacity: 0.03 },
    { col: 14, row: 4, w: 4, h: 3, opacity: 0.03 },
  ];

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
      <defs>
        {/* Radial gradient for top-left bloom */}
        <radialGradient id="bloom-top-left" cx="-1.95%" cy="4.84%" r="57.6%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.14" />
          <stop offset="45%" stopColor="#0066FF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        {/* Radial gradient for bottom-center bloom */}
        <radialGradient id="bloom-bottom-center" cx="50%" cy="112.6%" r="61%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.11" />
          <stop offset="55%" stopColor="#0066FF" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        {/* Vignette gradient */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70.7%">
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      {/* Base fill */}
      <rect width="100%" height="100%" fill="#F7FAFA" />

      {/* Soft bloom top-left */}
      <rect width="100%" height="100%" fill="url(#bloom-top-left)" />

      {/* Soft bloom bottom-center */}
      <rect width="100%" height="100%" fill="url(#bloom-bottom-center)" />

      {/* Micro grid - vertical lines */}
      {Array.from({ length: cols + 1 }, (_, i) => {
        const isMajor = i % 4 === 0;
        return (
          <line
            key={`v-${i}`}
            x1={i * cellSize}
            y1={0}
            x2={i * cellSize}
            y2={826}
            stroke="#B9C4CE"
            strokeWidth={1}
            strokeOpacity={isMajor ? 0.28 : 0.22}
          />
        );
      })}

      {/* Micro grid - horizontal lines */}
      {Array.from({ length: rows + 1 }, (_, i) => {
        const isMajor = i % 4 === 0;
        return (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * cellSize}
            x2={2048}
            y2={i * cellSize}
            stroke="#B9C4CE"
            strokeWidth={1}
            strokeOpacity={isMajor ? 0.28 : 0.22}
          />
        );
      })}

      {/* Tinted tiles */}
      {tiles.map((tile, i) => (
        <rect
          key={`tile-${i}`}
          x={tile.col * cellSize}
          y={tile.row * cellSize}
          width={tile.w * cellSize}
          height={tile.h * cellSize}
          fill="#0066FF"
          fillOpacity={tile.opacity}
        />
      ))}

      {/* Vignette overlay */}
      <rect width="100%" height="100%" fill="url(#vignette)" />
    </svg>
  );
};
