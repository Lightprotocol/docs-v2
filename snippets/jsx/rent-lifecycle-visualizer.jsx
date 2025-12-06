export const RentLifecycleVisualizer = () => {
  const [time, setTime] = useState(0);
  const [lamports, setLamports] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [lastTopupTime, setLastTopupTime] = useState(0);
  const [phase, setPhase] = useState('uninitialized');
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [activeArrows, setActiveArrows] = useState([]);
  const [activeLines, setActiveLines] = useState([]);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  // Constants from rent config
  const RENT_PER_EPOCH = 388;
  const INITIAL_LAMPORTS = 17208;
  const TOPUP_LAMPORTS = 776;
  // 388 lamports per second (decreased every 1s tick)
  const LAMPORTS_PER_SECOND = RENT_PER_EPOCH;

  // Colors
  const GREY = { r: 161, g: 161, b: 170 };
  const RED = { r: 227, g: 89, b: 48 };
  const BLUE = { r: 120, g: 140, b: 180 }; // Subtle grey-blue

  // 7 transaction lines from edges to center (positioned around the visualization)
  // Each line has start point (edge) and ends at center (50, 50)
  const txLines = [
    { id: 0, x1: 5, y1: 20, x2: 50, y2: 50 },   // top-left
    { id: 1, x1: 95, y1: 15, x2: 50, y2: 50 },  // top-right
    { id: 2, x1: 0, y1: 50, x2: 50, y2: 50 },   // left
    { id: 3, x1: 100, y1: 55, x2: 50, y2: 50 }, // right
    { id: 4, x1: 10, y1: 85, x2: 50, y2: 50 },  // bottom-left
    { id: 5, x1: 90, y1: 90, x2: 50, y2: 50 },  // bottom-right
    { id: 6, x1: 50, y1: 0, x2: 50, y2: 50 },   // top
  ];

  const interpolateColor = (c1, c2, t) => {
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return {
      r: clamp(c1.r + (c2.r - c1.r) * t),
      g: clamp(c1.g + (c2.g - c1.g) * t),
      b: clamp(c1.b + (c2.b - c1.b) * t),
    };
  };

  const colorToRgba = (c, alpha = 1) => `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;

  const arrowIdRef = useRef(0);

  const triggerHighlight = () => {
    setIsHighlighted(true);
    setTimeout(() => setIsHighlighted(false), 500);

    // Add a new arrow with unique ID
    const arrowId = arrowIdRef.current++;
    setActiveArrows((prev) => [...prev, arrowId]);
    setTimeout(() => {
      setActiveArrows((prev) => prev.filter((id) => id !== arrowId));
    }, 500);
  };

  const triggerTransaction = (lineIndex) => {
    setActiveLines((prev) => [...prev, { id: lineIndex, startTime: Date.now() }]);
    setTimeout(() => {
      setActiveLines((prev) => prev.filter((l) => l.id !== lineIndex));
    }, 500);
  };

  // Cycle through lines for transactions
  const txLineIndexRef = useRef(0);
  const getNextLineIndex = () => {
    const index = txLineIndexRef.current;
    txLineIndexRef.current = (txLineIndexRef.current + 1) % txLines.length;
    return index;
  };

  const getAccountColor = () => {
    if (phase === 'uninitialized') return GREY;

    const timeSinceTopup = time - lastTopupTime;

    // Stay red for 0.8s, then fade directly to blue over 3s
    if (timeSinceTopup < 0.8) {
      return RED;
    } else {
      // Red directly to blue (stays at blue once transition completes)
      const t = Math.min(1, (timeSinceTopup - 0.8) / 3);
      return interpolateColor(RED, BLUE, t);
    }
  };

  const handleTopup = () => {
    setLamports((l) => l + TOPUP_LAMPORTS);
    setLastTopupTime(time);
    if (phase === 'uninitialized' || phase === 'cold') {
      setPhase('hot');
    }
    triggerHighlight();
    triggerTransaction(getNextLineIndex());
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200);
  };

  const handleReset = () => {
    setTime(0);
    setLamports(0);
    setPhase('uninitialized');
    setLastTopupTime(0);
    setIsRunning(true);
    setActiveLines([]);
    setActiveArrows([]);
    txLineIndexRef.current = 0;
    arrowIdRef.current = 0;
  };

  // Track last second for 1-second lamport decreases
  const lastSecondRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => {
        const newTime = t + 0.1;
        const currentSecond = Math.floor(newTime);

        // Initialize at t=0 (instant)
        if (t === 0 && newTime > 0) {
          setLamports(INITIAL_LAMPORTS);
          setLastTopupTime(0);
          setPhase('hot');
          triggerHighlight();
          triggerTransaction(getNextLineIndex());
          lastSecondRef.current = 0;
        }

        // Auto top-ups (faster cycle)
        if (newTime >= 2 && t < 2) {
          setLamports((l) => l + TOPUP_LAMPORTS);
          setLastTopupTime(2);
          triggerHighlight();
          triggerTransaction(getNextLineIndex());
        }
        if (newTime >= 2.5 && t < 2.5) {
          setLamports((l) => l + TOPUP_LAMPORTS);
          setLastTopupTime(2.5);
          triggerHighlight();
          triggerTransaction(getNextLineIndex());
        }
        if (newTime >= 3 && t < 3) {
          setLamports((l) => l + TOPUP_LAMPORTS);
          setLastTopupTime(3);
          triggerHighlight();
          triggerTransaction(getNextLineIndex());
        }
        if (newTime >= 3.3 && t < 3.3) {
          setLamports((l) => l + TOPUP_LAMPORTS);
          setLastTopupTime(3.3);
          triggerHighlight();
          triggerTransaction(getNextLineIndex());
        }

        // First cold at ~5.5s
        if (newTime >= 5.5 && t < 5.5) {
          setPhase('cold');
          setLamports(0);
        }

        // Re-initialize (Load) at 6s
        if (newTime >= 6 && t < 6) {
          setLamports(INITIAL_LAMPORTS);
          setLastTopupTime(6);
          setPhase('hot');
          triggerHighlight();
          triggerTransaction(getNextLineIndex());
        }

        // Second cold at ~8.5s
        if (newTime >= 8.5 && t < 8.5) {
          setPhase('cold');
          setLamports(0);
        }

        // Loop at 10s
        if (newTime >= 10) {
          setPhase('uninitialized');
          setLamports(0);
          setLastTopupTime(0);
          txLineIndexRef.current = 0;
          lastSecondRef.current = 0;
          return 0;
        }

        // Decrease lamports every 1 second when hot
        if (phase === 'hot' && currentSecond > lastSecondRef.current) {
          setLamports((l) => Math.max(0, l - LAMPORTS_PER_SECOND));
          lastSecondRef.current = currentSecond;
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

  const displayHours = Math.round(time);
  const accountColor = getAccountColor();

  // Diamond dots pattern
  const generateDiamondDots = () => {
    const dots = [];
    const size = 5;
    const centerSize = 4;

    for (let row = -size; row <= size; row++) {
      const width = size - Math.abs(row);
      for (let col = -width; col <= width; col++) {
        const distFromCenter = Math.max(Math.abs(row), Math.abs(col));
        const dotSize = Math.max(1, centerSize - distFromCenter * 0.6);
        const opacity = Math.max(0.2, 1 - distFromCenter * 0.15);

        dots.push({
          x: 50 + col * 6,
          y: 50 + row * 6,
          size: dotSize,
          opacity,
        });
      }
    }
    return dots;
  };

  const diamondDots = generateDiamondDots();

  const isLineActive = (lineId) => activeLines.some((l) => l.id === lineId);

  return (
    <div
      className="relative p-6 my-4 overflow-hidden"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* CSS for animations */}
      <style>{`
        @keyframes scrollTimeline {
          from { transform: translateX(0); }
          to { transform: translateX(-32px); }
        }
        .timeline-scroll {
          animation: scrollTimeline 0.5s linear infinite;
        }
        @keyframes bobbleMove {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        .tx-bobble {
          animation: bobbleMove 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); font-weight: 500; }
          50% { opacity: 0.8; transform: scale(1.12); font-weight: 700; }
        }
        .topup-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .btn-interactive {
          position: relative;
          overflow: hidden;
          background: rgba(120, 140, 180, 0.08);
          border-color: rgba(120, 140, 180, 0.25);
          color: rgb(90, 110, 150);
        }
        .dark .btn-interactive {
          background: rgba(120, 140, 180, 0.12);
          border-color: rgba(120, 140, 180, 0.3);
          color: rgba(180, 200, 230, 0.9);
        }
        .btn-interactive::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(120, 140, 180, 0.15), transparent);
          transition: left 0.5s ease;
        }
        .btn-interactive:hover::before {
          left: 100%;
        }
        .btn-interactive:hover {
          background: rgba(120, 140, 180, 0.15);
          border-color: rgba(120, 140, 180, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(120, 140, 180, 0.2);
        }
        .dark .btn-interactive:hover {
          background: rgba(120, 140, 180, 0.2);
          box-shadow: 0 4px 12px rgba(120, 140, 180, 0.15);
        }
        @keyframes arrowUp {
          0% { opacity: 0; transform: translateY(4px); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        .arrow-up {
          animation: arrowUp 0.5s ease-out forwards;
        }
      `}</style>

      {/* Main visualization area */}
      <div className="relative flex items-center justify-center" style={{ height: '11.5rem' }}>
        {/* Transaction lines SVG layer */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {txLines.map((line) => {
            const active = isLineActive(line.id);
            return (
              <g key={line.id}>
                {/* Line */}
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={active ? 'rgba(161, 161, 170, 0.5)' : 'rgba(161, 161, 170, 0)'}
                  strokeWidth={active ? 0.8 : 0}
                  style={{ transition: 'stroke 0.15s, stroke-width 0.15s' }}
                />
                {/* Bobble that travels along the line when active */}
                {active && (
                  <circle
                    r="2"
                    fill="rgba(161, 161, 170, 0.8)"
                    style={{
                      offsetPath: `path('M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}')`,
                    }}
                    className="tx-bobble"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Timeline with fading edges */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        >
          {/* Continuously scrolling tick marks */}
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div className="flex items-center gap-8 timeline-scroll">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-300 dark:bg-white/20 flex-shrink-0"
                  style={{ width: '1px', height: '0.875rem' }}
                />
              ))}
            </div>
          </div>

          {/* Center line */}
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-white/30 to-transparent" />
        </div>

        {/* Diamond Account - centered */}
        <div
          className="absolute z-10"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            filter: (() => {
              const timeSinceTopup = time - lastTopupTime;
              if (timeSinceTopup < 1.5) {
                // Hot glow fading out
                const intensity = Math.max(0, 1 - timeSinceTopup / 1.5);
                return `drop-shadow(0 0 ${20 * intensity + 5}px rgba(227, 89, 48, ${0.7 * intensity})) drop-shadow(0 0 ${8 * intensity + 2}px rgba(255, 150, 50, ${0.8 * intensity}))`;
              }
              return 'none';
            })(),
            transition: 'filter 0.3s ease',
          }}
        >
          <svg width="138" height="138" viewBox="0 0 100 100">
            {diamondDots.map((dot, i) => (
              <circle
                key={i}
                cx={dot.x}
                cy={dot.y}
                r={dot.size}
                fill={colorToRgba(accountColor, dot.opacity * 0.7)}
                style={{ transition: 'fill 0.3s ease' }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Counters */}
      <div className="flex items-start mt-4">
        {/* Left: Time at 45% with padding to push right */}
        <div className="text-center" style={{ width: '45%', paddingLeft: '20%' }}>
          <div className="font-mono font-medium text-zinc-700 dark:text-white/80" style={{ fontSize: '1.3rem' }}>
            {displayHours}h
          </div>
          <div className="text-zinc-500 dark:text-white/50 uppercase tracking-wide" style={{ fontSize: '0.7rem' }}>
            Time
          </div>
        </div>

        {/* Right: Rent Balance at 55% */}
        <div className="text-center" style={{ width: '55%' }}>
          <div style={{ height: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="relative flex items-center" style={{ width: '1.2rem', marginRight: '0.25rem', height: '1.3rem' }}>
              {activeArrows.map((arrowId) => (
                <span
                  key={arrowId}
                  className="arrow-up absolute"
                  style={{ color: 'rgb(34, 197, 94)', fontSize: '1.3rem', left: 0, lineHeight: 1 }}
                >
                  ↑
                </span>
              ))}
            </div>
            <span
              className="font-mono text-zinc-700 dark:text-white/80 transition-all duration-150"
              style={{
                fontSize: isHighlighted ? '1.45rem' : '1.3rem',
                fontWeight: isHighlighted ? 700 : 500,
                transformOrigin: 'center',
                transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {lamports.toLocaleString()}
            </span>
            <span
              className="text-zinc-400 dark:text-white/40 transition-all duration-150 ml-1"
              style={{
                fontSize: isHighlighted ? '1rem' : '0.875rem',
                fontWeight: isHighlighted ? 700 : 400,
              }}
            >lamports</span>
          </div>
          <div className="text-zinc-500 dark:text-white/50 uppercase tracking-wide" style={{ fontSize: '0.7rem' }}>
            Rent Balance
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-start mt-4">
        <div className="text-center" style={{ width: '45%', paddingLeft: '20%' }}>
          <button
            onClick={handleReset}
            className="font-medium rounded-lg border backdrop-blur-sm transition-all btn-interactive"
            style={{ padding: '0.6rem 1.15rem', fontSize: '0.9rem' }}
          >
            Back to Start
          </button>
        </div>
        <div className="text-center" style={{ width: '55%', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            onClick={handleTopup}
            className={`rounded-lg border backdrop-blur-sm transition-all btn-interactive
              topup-pulse ${isButtonPressed ? 'font-bold' : 'font-medium'}`}
            style={{
              padding: '0.6rem 1.15rem',
              fontSize: isButtonPressed ? '1rem' : '0.9rem',
              transform: isButtonPressed ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            Top Up
          </button>
        </div>
      </div>
    </div>
  );
};
