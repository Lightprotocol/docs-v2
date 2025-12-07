export const RentLifecycleVisualizer = () => {
  const [, setTime] = useState(0);
  const [lamports, setLamports] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('uninitialized');
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [activeArrows, setActiveArrows] = useState([]);
  const [activeLines, setActiveLines] = useState([]);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [flyingArrows, setFlyingArrows] = useState([]);
  const [floatingAmounts, setFloatingAmounts] = useState([]);
  const [resetCount, setResetCount] = useState(0);

  // Constants from rent config
  const LAMPORTS_PER_TICK = 77.6;       // 388 per epoch / 5 ticks = smooth decrement
  const LAMPORTS_PER_TICK_SLOW = 50;    // Faster drain in cold zone to reach 0 before loop
  const INITIAL_RENT = 6208;            // 24h of rent (16 epochs × 388)
  const TOPUP_LAMPORTS = 776;           // 3h worth (2 epochs)
  const TOPUP_THRESHOLD = 776;          // Top up when below 3h of rent
  const COLD_THRESHOLD = 388;           // Cold when below 1 epoch of rent
  // Time scale: 0.5s per epoch → 16 epochs = 8s to deplete, 30s total cycle

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

  // Format lamports: always ~X,XXX rounded to nearest 500
  const formatLamports = (l) => {
    if (l <= 0) return '0';
    const rounded = Math.round(l / 500) * 500;
    return `~${rounded.toLocaleString()}`;
  };

  const arrowIdRef = useRef(0);
  const flyingArrowIdRef = useRef(0);
  const floatingAmountIdRef = useRef(0);

  const triggerFlyingArrow = (amount, lineIndex) => {
    const id = flyingArrowIdRef.current++;
    setFlyingArrows((prev) => [...prev, id]);
    setTimeout(() => {
      setFlyingArrows((prev) => prev.filter((a) => a !== id));
    }, 600);

    // Also show floating amount at the source of the transaction line
    const amountId = floatingAmountIdRef.current++;
    const line = txLines[lineIndex] || txLines[0];
    setFloatingAmounts((prev) => [...prev, { id: amountId, amount, x: line.x1, y: line.y1 }]);
    setTimeout(() => {
      setFloatingAmounts((prev) => prev.filter((a) => a.id !== amountId));
    }, 800);
  };

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
  const lastLineIndexRef = useRef(0);
  const getNextLineIndex = () => {
    const index = txLineIndexRef.current;
    txLineIndexRef.current = (txLineIndexRef.current + 1) % txLines.length;
    lastLineIndexRef.current = index;
    return index;
  };

  const getAccountColor = () => {
    if (phase === 'uninitialized') return GREY;
    if (phase === 'cold') return BLUE;

    // Color based on lamports threshold
    if (lamports > TOPUP_THRESHOLD) {
      // Above 776: stay red (hot)
      return RED;
    } else if (lamports > COLD_THRESHOLD) {
      // Between 776 and 388: fade red → blue
      const t = 1 - (lamports - COLD_THRESHOLD) / (TOPUP_THRESHOLD - COLD_THRESHOLD);
      return interpolateColor(RED, BLUE, t);
    } else {
      // Below 388: cold (blue)
      return BLUE;
    }
  };

  const handleTopup = () => {
    // Always trigger a transaction
    triggerTransaction(getNextLineIndex());
    setIsButtonPressed(true);
    setTimeout(() => setIsButtonPressed(false), 200);

    // If cold/uninitialized, re-initialize with full amount
    if (phase === 'uninitialized' || phase === 'cold' || lamports === 0) {
      setLamports(INITIAL_RENT);
      setPhase('hot');
      triggerHighlight();
      triggerFlyingArrow(INITIAL_RENT, lastLineIndexRef.current);
      return;
    }

    // Only top up if below threshold (3h = 776 lamports)
    if (lamports < TOPUP_THRESHOLD) {
      setLamports((l) => l + TOPUP_LAMPORTS);
      triggerHighlight();
      triggerFlyingArrow(TOPUP_LAMPORTS, lastLineIndexRef.current);
    }
    // Otherwise just the transaction happens (no rent top-up needed)
  };

  // 38-second transaction schedule with realistic spam patterns (10% slower)
  const txTimesRef = useRef([
    // Phase 1: Heavy burst at start (0.5-6s) - shows active account
    0.9, 1.2, 1.5, 1.9, 2.3, 2.8, 3.2, 3.6, 4.1, 4.6, 5.2, 5.8,
    // Phase 2: Continued activity (6-8.5s)
    6.4, 7.0, 7.6,
    // Phase 3: Top-ups as rent depletes (~8.5-10.5s) - 3 top-ups
    8.5, 9.4, 10.2,
    // Phase 4: Goes cold, reinit
    13.5,
    // Phase 5: Second cycle spam (14-18.5s)
    14.1, 14.6, 15.2, 15.8, 16.4, 17.1, 17.7, 18.4,
    // Phase 6: Top-ups again (~19-20.5s) - 2 top-ups
    19.3, 20.4,
    // Phase 7: Goes cold, reinit
    23.1,
    // Phase 8: Final burst (23.5-29.5s)
    23.7, 24.2, 24.8, 25.4, 26.1, 26.7, 27.5, 28.3, 29.2,
    // Phase 9: Let it drain and go cold before loop (29-38s)
  ]);

  const handleReset = () => {
    setTime(0);
    setLamports(0);
    setPhase('uninitialized');
    setIsRunning(true);
    setActiveLines([]);
    setActiveArrows([]);
    setFlyingArrows([]);
    setResetCount((c) => c + 1);
    txLineIndexRef.current = 0;
    arrowIdRef.current = 0;
    flyingArrowIdRef.current = 0;
  };

  // Start animation when component scrolls into view
  useEffect(() => {
    if (hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRunning(true);
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((t) => {
        const newTime = t + 0.1;

        // Initialize at t=0.5 (after brief pause showing uninitialized state)
        if (t < 0.5 && newTime >= 0.5) {
          setLamports(INITIAL_RENT);
          setPhase('hot');
          triggerHighlight();
          triggerTransaction(getNextLineIndex());
        }

        // Check for scheduled transactions
        txTimesRef.current.forEach((txTime) => {
          if (newTime >= txTime && t < txTime) {
            // Transaction happens - show line animation
            triggerTransaction(getNextLineIndex());

            // Handle based on current state
            if (phase === 'cold') {
              // Reinitialize from cold state
              setLamports(INITIAL_RENT);
              setPhase('hot');
              triggerHighlight();
              triggerFlyingArrow(INITIAL_RENT, lastLineIndexRef.current);
            } else if (phase === 'hot') {
              // Only top up if below threshold (3h = 776 lamports = 2 epochs)
              setLamports((currentLamports) => {
                if (currentLamports > 0 && currentLamports < TOPUP_THRESHOLD) {
                  triggerHighlight();
                  triggerFlyingArrow(TOPUP_LAMPORTS, lastLineIndexRef.current);
                  return currentLamports + TOPUP_LAMPORTS;
                }
                return currentLamports;
              });
            }
          }
        });

        // Smooth lamport decrement every tick (100ms) when hot or cold
        // Slower in critical zone (below 1000) so users can see the 776→388 transition
        if ((phase === 'hot' || phase === 'cold') && newTime > 0.1) {
          setLamports((l) => {
            const tickAmount = l < 1000 ? LAMPORTS_PER_TICK_SLOW : LAMPORTS_PER_TICK;
            const newLamports = Math.max(0, l - tickAmount);
            // Go cold when lamports below cold threshold
            if (newLamports < COLD_THRESHOLD) {
              setPhase('cold');
            }
            return newLamports;
          });
        }

        // Loop at 38s (extra 4s for cold fade)
        if (newTime >= 38) {
          setPhase('uninitialized');
          setLamports(0);
          txLineIndexRef.current = 0;
          return 0;
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, phase]);

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
      ref={containerRef}
      className="relative p-6 my-4 overflow-hidden"
      style={{ fontFamily: "'Inter', 'IBM Plex Mono'" }}
    >
      {/* CSS for animations */}
      <style>{`
        @keyframes scrollTimeline {
          from { transform: translateX(0); }
          to { transform: translateX(-170rem); }
        }
        .timeline-scroll {
          animation: scrollTimeline 38s linear infinite;
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
        .btn-interactive {
          position: relative;
          overflow: hidden;
          background: rgba(120, 140, 180, 0.06);
          border: 1px solid rgba(120, 140, 180, 0.2);
          border-bottom-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          color: rgb(0, 0, 0);
        }
        .dark .btn-interactive {
          background: rgba(120, 140, 180, 0.1);
          border: 1px solid rgba(120, 140, 180, 0.25);
          border-bottom-color: rgba(0, 0, 0, 0.2);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          color: rgb(255, 255, 255);
        }
        .btn-interactive:hover {
          background: rgba(120, 140, 180, 0.1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        .dark .btn-interactive:hover {
          background: rgba(120, 140, 180, 0.15);
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .btn-interactive:active {
          background: rgba(120, 140, 180, 0.12);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
          transform: translateY(0.5px);
        }
        .dark .btn-interactive:active {
          background: rgba(120, 140, 180, 0.18);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }
        @keyframes arrowUp {
          0% { opacity: 0; transform: translateY(calc(-50% + 4px)); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(calc(-50% - 8px)); }
        }
        .arrow-up {
          animation: arrowUp 0.5s ease-out forwards;
        }
        @keyframes arrowFlyUp {
          0% { opacity: 1; transform: translateY(calc(-50% + 24px)); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(calc(-50% - 8px)); }
        }
        .arrow-fly-up {
          animation: arrowFlyUp 0.4s ease-out forwards;
        }
        @keyframes amountFlyUp {
          0% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .amount-fly-up {
          animation: amountFlyUp 0.8s ease-out forwards;
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
          {/* Floating amounts at transaction source */}
          {floatingAmounts.map(({ id, amount, x, y }) => (
            <text
              key={id}
              x={x}
              y={y}
              className="amount-fly-up"
              style={{
                fill: 'rgb(34, 197, 94)',
                fontSize: '8px',
                fontWeight: 700,
                fontFamily: 'ui-monospace, monospace',
                textAnchor: 'middle',
                dominantBaseline: 'middle',
              }}
            >
              +{amount.toLocaleString()}
            </text>
          ))}
        </svg>

        {/* Timeline with fading edges and gap behind diamond */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 35%, transparent 45%, transparent 55%, black 65%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 35%, transparent 45%, transparent 55%, black 65%, black 85%, transparent)',
          }}
        >
          {/* Continuously scrolling tick marks with hour labels below */}
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div key={resetCount} className="flex items-center timeline-scroll" style={{ gap: '5rem' }}>
              {[...Array(34).keys()].map(i => i * 3).concat([...Array(34).keys()].map(i => i * 3)).map((h, i) => (
                <div key={i} className="flex flex-col items-center flex-shrink-0">
                  <span
                    className="font-mono text-zinc-300 dark:text-white/20 mb-2"
                    style={{ fontSize: '1rem' }}
                  >
                    {h}h
                  </span>
                  <div className="w-px h-3 bg-zinc-200 dark:bg-white/20" />
                </div>
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
            filter: activeLines.length > 0
              ? 'drop-shadow(0 0 25px rgba(227, 89, 48, 0.7)) drop-shadow(0 0 10px rgba(255, 150, 50, 0.8))'
              : 'none',
            transition: 'filter 0.15s ease',
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

      {/* Rent Balance - centered */}
      <div className="flex justify-center mt-4">
        {/* Arrows container - separate from number */}
        <div
          className="relative flex items-center justify-end mr-2"
          style={{ width: '1.5rem', height: '2.2rem' }}
        >
          {activeArrows.map((arrowId) => (
            <span
              key={arrowId}
              className="arrow-up absolute"
              style={{ color: 'rgb(34, 197, 94)', fontSize: '1.7rem', right: 0, top: '50%', transform: 'translateY(-50%)', lineHeight: 1 }}
            >
              ↑
            </span>
          ))}
          {flyingArrows.map((id) => (
            <span
              key={id}
              className="arrow-fly-up absolute"
              style={{ color: 'rgb(34, 197, 94)', fontSize: '1.7rem', right: 0, top: '50%', lineHeight: 1 }}
            >
              ↑
            </span>
          ))}
        </div>
        <div className="text-center">
          <div style={{ height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span
              className="font-mono text-zinc-700 dark:text-white/80 transition-all duration-150"
              style={{
                fontSize: isHighlighted ? '1.9rem' : '1.7rem',
                fontWeight: isHighlighted ? 700 : 500,
                transformOrigin: 'center',
                transform: isHighlighted ? 'scale(1.05)' : 'scale(1)',
                fontVariantNumeric: 'tabular-nums',
                minWidth: '6.5rem',
                textAlign: 'right',
              }}
            >
              {formatLamports(lamports)}
            </span>
            <span
              className="text-zinc-400 dark:text-white/40 transition-all duration-150 ml-1"
              style={{
                fontSize: isHighlighted ? '1.45rem' : '1.15rem',
                fontWeight: isHighlighted ? 800 : 400,
              }}
            >lamports</span>
          </div>
          <div className="text-zinc-500 dark:text-white/50 uppercase tracking-wide" style={{ fontSize: '0.9rem' }}>
            Rent Balance
          </div>
        </div>
      </div>

      {/* Buttons row - centered, side by side */}
      <div className="flex justify-center gap-4 mt-3">
        <button
          onClick={handleReset}
          className="font-medium rounded-lg border backdrop-blur-sm transition-all btn-interactive"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          Back to Start
        </button>
        <button
          onClick={handleTopup}
          className={`rounded-lg border backdrop-blur-sm transition-all ${isButtonPressed ? 'font-bold' : 'font-medium'}`}
          style={{
            padding: '0.5rem 1rem',
            fontSize: isButtonPressed ? '0.95rem' : '0.85rem',
            transform: isButtonPressed ? 'scale(1.15)' : 'scale(1)',
            background: '#0066ff',
            borderColor: '#0066ff',
            color: '#fff',
          }}
        >
          Send Tx
        </button>
      </div>
    </div>
  );
};
