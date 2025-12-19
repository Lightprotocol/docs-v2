export const HeroBackground = () => {
  const cellSize = 91;
  const cols = 23; // 2048 / 91 ≈ 22.5
  const rows = 10; // 826 / 91 ≈ 9

  // Tinted tiles configuration - distributed across grid
  const tiles = [
    // Top row scattered
    { col: 1, row: 0, w: 2, h: 1, opacity: 0.04 },
    { col: 8, row: 0, w: 1, h: 2, opacity: 0.05 },
    { col: 20, row: 1, w: 2, h: 2, opacity: 0.04 },
    // Upper-middle area
    { col: 3, row: 2, w: 2, h: 2, opacity: 0.05 },
    { col: 16, row: 2, w: 1, h: 2, opacity: 0.05 },
    // Center area (sparse, horizontal)
    { col: 5, row: 5, w: 3, h: 1, opacity: 0.03 },
    { col: 12, row: 3, w: 2, h: 1, opacity: 0.04 },
    // Lower area
    { col: 0, row: 6, w: 2, h: 2, opacity: 0.04 },
    { col: 9, row: 6, w: 2, h: 1, opacity: 0.03 },
    { col: 18, row: 5, w: 2, h: 2, opacity: 0.04 },
    // Bottom scattered right
    { col: 4, row: 8, w: 1, h: 1, opacity: 0.03 },
    { col: 14, row: 7, w: 2, h: 2, opacity: 0.03 },
    { col: 21, row: 8, w: 2, h: 1, opacity: 0.04 },
    // Bottom scattered left
    { col: 4, row: 8, w: 1, h: 1, opacity: 0.03 },
    { col: 4, row: 7, w: 2, h: 2, opacity: 0.03 },
    { col: 21, row: 8, w: 2, h: 1, opacity: 0.04 },
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
        {/* Noise filter for subtle texture */}
        <filter id="noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>

        {/* Radial gradient for top-left bloom */}
        <radialGradient id="bloom-top-left" cx="-1.95%" cy="4.84%" r="57.6%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.18" />
          <stop offset="45%" stopColor="#0066FF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        {/* Radial gradient for top-right bloom */}
        <radialGradient id="bloom-top-right" cx="105%" cy="10%" r="50%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#0066FF" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        {/* Radial gradient for bottom-center bloom */}
        <radialGradient id="bloom-bottom-center" cx="50%" cy="112.6%" r="61%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#0066FF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        {/* Center glow */}
        <radialGradient id="center-glow" cx="50%" cy="40%" r="45%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        {/* Vignette gradient */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70.7%">
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.55" />
        </radialGradient>

        {/* Bottom fade to white */}
        <linearGradient id="bottom-fade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Base fill */}
      <rect width="100%" height="100%" fill="#F7FAFA" />

      {/* Subtle noise texture overlay */}
      <rect width="100%" height="100%" fill="#F7FAFA" filter="url(#noise)" opacity="0.03" />

      {/* Soft bloom top-left */}
      <rect width="100%" height="100%" fill="url(#bloom-top-left)" />

      {/* Soft bloom top-right */}
      <rect width="100%" height="100%" fill="url(#bloom-top-right)" />

      {/* Center glow */}
      <rect width="100%" height="100%" fill="url(#center-glow)" />

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

      {/* Bottom fade to white for smooth transition */}
      <rect width="100%" height="100%" fill="url(#bottom-fade)" />
    </svg>
  );
};
