export const CodeCompare = ({
  firstCode = "",
  secondCode = "",
  firstLabel = "Light-Token",
  secondLabel = "SPL",
  initialPosition = 50,
}) => {
  const [sliderPercent, setSliderPercent] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  // Syntax highlighting for TypeScript - single-pass to avoid regex conflicts
  const highlightCode = (code) => {
    // HTML escape first
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Combined pattern that matches in priority order
    const pattern = /(\/\/.*$)|(["'`])(?:(?!\2)[^\\]|\\.)*?\2|\b(const|let|var|await|async|import|from|export|return|if|else|function|class|new|throw|try|catch)\b|\.([a-zA-Z_][a-zA-Z0-9_]*)\b|\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/gm;

    return escaped.replace(pattern, (match, comment, stringQuote, keyword, property, func) => {
      if (comment) {
        return `<span style="color:#6b7280;font-style:italic">${match}</span>`;
      }
      if (stringQuote) {
        return `<span style="color:#059669">${match}</span>`;
      }
      if (keyword) {
        return `<span style="color:#db2777">${match}</span>`;
      }
      if (property) {
        return `.<span style="color:#0891b2">${property}</span>`;
      }
      if (func) {
        return `<span style="color:#2563eb">${match}</span>`;
      }
      return match;
    });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setHasInteracted(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPercent(percent);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    setHasInteracted(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPercent(percent);
  };

  const handleKeyDown = (e) => {
    setHasInteracted(true);
    if (e.key === "ArrowLeft") {
      setSliderPercent((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPercent((p) => Math.min(100, p + 5));
    }
  };

  // Auto-demo animation - slides the actual slider to show functionality
  useEffect(() => {
    if (hasInteracted) return;

    let animationId;
    let startTime;
    const duration = 2000; // 2s per cycle
    const startPos = initialPosition;
    const endPos = 20; // Slide slightly to hint at functionality

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const cycle = (elapsed % (duration * 2)) / duration; // 0-2 range

      // Ease in-out: go to endPos then back to startPos
      let progress;
      if (cycle < 1) {
        progress = cycle; // Going to endPos
      } else {
        progress = 2 - cycle; // Coming back to startPos
      }

      // Smooth easing
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const newPos = startPos + (endPos - startPos) * eased;
      setSliderPercent(newPos);

      // Stop after 1 full cycle (4 seconds)
      if (elapsed < duration * 2) {
        animationId = requestAnimationFrame(animate);
      } else {
        setSliderPercent(initialPosition);
      }
    };

    // Start after a short delay
    const timeout = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [hasInteracted, initialPosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  // Icon components
  const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  const ExternalIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );

  return (
    <>
      <div
        ref={containerRef}
        className="p-0 rounded-3xl not-prose mt-4 dark:bg-white/5 backdrop-blur-xl border border-zinc-300 dark:border-zinc-600 overflow-hidden"
        style={{
          fontFamily: 'Inter, sans-serif',
          cursor: isDragging ? "grabbing" : "default",
        }}
        onTouchMove={handleTouchMove}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-valuenow={sliderPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Code comparison slider"
      >
      {/* Code container - no header, just code */}
      <div className="relative" style={{ minHeight: "140px", overflowX: "auto" }}>
        {/* Grid wrapper to stack both code blocks */}
        <div style={{ display: "grid" }}>
          {/* Second code (background - SPL) */}
          <pre
            className="m-0 p-4 text-zinc-700 dark:text-white/80 bg-transparent"
            style={{
              gridArea: "1/1",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              whiteSpace: "pre",
              zIndex: 1,
            }}
            dangerouslySetInnerHTML={{ __html: highlightCode(secondCode) }}
          />

          {/* First code (foreground - Light-Token) with clip-path - MUST be opaque to cover background */}
          <pre
            className="m-0 p-4 text-zinc-700 dark:text-white/80 bg-white dark:bg-zinc-900"
            style={{
              gridArea: "1/1",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              whiteSpace: "pre",
              zIndex: 2,
              clipPath: `inset(0 ${100 - sliderPercent}% 0 0)`,
            }}
            dangerouslySetInnerHTML={{ __html: highlightCode(firstCode) }}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none"
          style={{
            left: `${sliderPercent}%`,
            transform: "translateX(-50%)",
            zIndex: 30,
          }}
        >
          {/* Grey line */}
          <div className="absolute top-0 bottom-0 w-px bg-zinc-400 dark:bg-white/30" />

          {/* Blue glow fading to left starting at the line */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              right: "50%",
              width: "80px",
              background: "linear-gradient(to left, rgba(59, 130, 246, 0.12) 0%, transparent 100%)",
            }}
          />

          {/* Handle button */}
          <div
            onMouseDown={handleMouseDown}
            className="pointer-events-auto cursor-grab flex items-center justify-center gap-px transition-transform"
            style={{
              width: "20px",
              height: "32px",
              borderRadius: "4px",
              background: "#f8fafc",
              border: "1px solid #d1d5db",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transform: isDragging ? "scale(1.08)" : "scale(1)",
            }}
          >
            {/* Grip dots */}
            <div className="flex flex-col gap-0.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-0.5 h-0.5 rounded-full bg-indigo-500"
                />
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-0.5 h-0.5 rounded-full bg-indigo-500"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};
