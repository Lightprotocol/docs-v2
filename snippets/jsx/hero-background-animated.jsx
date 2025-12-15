export const HeroBackground = () => {
  const cellSize = 91;
  const cols = 23;
  const rows = 10;

  // Tiles with individual animation configs
  // Avoiding row 4 (middle empty zone)
  // Organic timing: durations 3-5s, staggered delays for smooth flow
  const tiles = [
    // Top area (rows 0-3)
    { col: 1, row: 0, w: 2, h: 1, delay: 0, duration: 4, maxOpacity: 0.06 },
    { col: 8, row: 0, w: 1, h: 2, delay: 1.3, duration: 4.5, maxOpacity: 0.05 },
    { col: 15, row: 0, w: 1, h: 1, delay: 2.8, duration: 3.5, maxOpacity: 0.04 },
    { col: 20, row: 1, w: 2, h: 2, delay: 0.7, duration: 5, maxOpacity: 0.05 },
    { col: 3, row: 2, w: 2, h: 2, delay: 2.1, duration: 4, maxOpacity: 0.06 },
    { col: 11, row: 1, w: 1, h: 1, delay: 3.9, duration: 3.5, maxOpacity: 0.04 },
    { col: 16, row: 2, w: 1, h: 2, delay: 0.5, duration: 4.5, maxOpacity: 0.05 },
    { col: 6, row: 1, w: 1, h: 1, delay: 4.6, duration: 4, maxOpacity: 0.03 },
    { col: 12, row: 3, w: 2, h: 1, delay: 1.8, duration: 3.5, maxOpacity: 0.05 },
    { col: 0, row: 2, w: 1, h: 1, delay: 4.2, duration: 4.5, maxOpacity: 0.04 },
    { col: 19, row: 0, w: 1, h: 1, delay: 3.1, duration: 4, maxOpacity: 0.03 },
    { col: 22, row: 3, w: 1, h: 1, delay: 1.0, duration: 3.5, maxOpacity: 0.04 },

    // Bottom area (rows 5-9)
    { col: 5, row: 5, w: 3, h: 1, delay: 2.0, duration: 4.5, maxOpacity: 0.04 },
    { col: 0, row: 6, w: 2, h: 2, delay: 0.3, duration: 4, maxOpacity: 0.05 },
    { col: 9, row: 6, w: 2, h: 1, delay: 3.4, duration: 3.5, maxOpacity: 0.04 },
    { col: 18, row: 5, w: 2, h: 2, delay: 1.5, duration: 5, maxOpacity: 0.05 },
    { col: 4, row: 7, w: 2, h: 2, delay: 4.5, duration: 4, maxOpacity: 0.04 },
    { col: 14, row: 7, w: 2, h: 2, delay: 0.9, duration: 4.5, maxOpacity: 0.04 },
    { col: 21, row: 8, w: 2, h: 1, delay: 3.0, duration: 3.5, maxOpacity: 0.05 },
    { col: 4, row: 8, w: 1, h: 1, delay: 5.2, duration: 4, maxOpacity: 0.03 },
    { col: 11, row: 5, w: 1, h: 1, delay: 0.2, duration: 3.5, maxOpacity: 0.04 },
    { col: 2, row: 9, w: 1, h: 1, delay: 2.5, duration: 4.5, maxOpacity: 0.03 },
    { col: 16, row: 6, w: 1, h: 1, delay: 3.7, duration: 4, maxOpacity: 0.04 },
    { col: 8, row: 8, w: 1, h: 1, delay: 1.2, duration: 3.5, maxOpacity: 0.03 },
    { col: 13, row: 9, w: 2, h: 1, delay: 4.3, duration: 4, maxOpacity: 0.04 },
    { col: 20, row: 6, w: 1, h: 1, delay: 2.7, duration: 4.5, maxOpacity: 0.03 },
    { col: 7, row: 5, w: 1, h: 1, delay: 1.0, duration: 3.5, maxOpacity: 0.04 },
    { col: 22, row: 5, w: 1, h: 2, delay: 4.8, duration: 4, maxOpacity: 0.03 },
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
        <style>
          {`
            @keyframes tileAppear {
              0% { opacity: 0; }
              25% { opacity: 1; }
              75% { opacity: 1; }
              100% { opacity: 0; }
            }
            @keyframes bloomBreathe {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.75; }
            }
            @keyframes gridShimmer {
              0%, 100% { stroke-opacity: 0.22; }
              50% { stroke-opacity: 0.16; }
            }
            @keyframes gridShimmerMajor {
              0%, 100% { stroke-opacity: 0.28; }
              50% { stroke-opacity: 0.20; }
            }
            .bloom-layer {
              animation: bloomBreathe 5s ease-in-out infinite;
            }
            .bloom-tl { animation-delay: 0s; }
            .bloom-tr { animation-delay: 1.2s; }
            .bloom-center { animation-delay: 2.4s; }
            .bloom-bottom { animation-delay: 3.6s; }
          `}
        </style>

        <filter id="noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>

        <radialGradient id="bloom-top-left" cx="-1.95%" cy="4.84%" r="57.6%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.18" />
          <stop offset="45%" stopColor="#0066FF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="bloom-top-right" cx="105%" cy="10%" r="50%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#0066FF" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="bloom-bottom-center" cx="50%" cy="112.6%" r="61%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#0066FF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="center-glow" cx="50%" cy="40%" r="45%">
          <stop offset="0%" stopColor="#0066FF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="vignette" cx="50%" cy="50%" r="70.7%">
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.55" />
        </radialGradient>

        <linearGradient id="bottom-fade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#F7FAFA" />
      <rect width="100%" height="100%" fill="#F7FAFA" filter="url(#noise)" opacity="0.03" />

      <rect className="bloom-layer bloom-tl" width="100%" height="100%" fill="url(#bloom-top-left)" />
      <rect className="bloom-layer bloom-tr" width="100%" height="100%" fill="url(#bloom-top-right)" />
      <rect className="bloom-layer bloom-center" width="100%" height="100%" fill="url(#center-glow)" />
      <rect className="bloom-layer bloom-bottom" width="100%" height="100%" fill="url(#bloom-bottom-center)" />

      {Array.from({ length: cols + 1 }, (_, i) => {
        const isMajor = i % 4 === 0;
        const delay = (i / cols) * 2;
        return (
          <line
            key={`v-${i}`}
            x1={i * cellSize}
            y1={0}
            x2={i * cellSize}
            y2={826}
            stroke="#B9C4CE"
            strokeWidth={1}
            style={{
              animation: `${isMajor ? 'gridShimmerMajor' : 'gridShimmer'} 4s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}

      {Array.from({ length: rows + 1 }, (_, i) => {
        const isMajor = i % 4 === 0;
        const delay = (i / rows) * 2;
        return (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * cellSize}
            x2={2048}
            y2={i * cellSize}
            stroke="#B9C4CE"
            strokeWidth={1}
            style={{
              animation: `${isMajor ? 'gridShimmerMajor' : 'gridShimmer'} 4s ease-in-out infinite`,
              animationDelay: `${delay + 1}s`,
            }}
          />
        );
      })}

      {tiles.map((tile, i) => (
        <rect
          key={`tile-${i}`}
          x={tile.col * cellSize}
          y={tile.row * cellSize}
          width={tile.w * cellSize}
          height={tile.h * cellSize}
          fill="#0066FF"
          style={{
            opacity: 0,
            animation: `tileAppear ${tile.duration}s ease-in-out infinite`,
            animationDelay: `${tile.delay}s`,
            '--max-opacity': tile.maxOpacity,
          }}
          fillOpacity={tile.maxOpacity}
        />
      ))}

      <rect width="100%" height="100%" fill="url(#vignette)" />
      <rect width="100%" height="100%" fill="url(#bottom-fade)" />
    </svg>
  );
};
