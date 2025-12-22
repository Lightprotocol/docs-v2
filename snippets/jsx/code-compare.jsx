export const CodeCompare = ({
  firstCode = "",
  secondCode = "",
  firstLabel = "Light-Token",
  secondLabel = "SPL",
}) => {
  const [sliderPercent, setSliderPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  const isLightMode = sliderPercent > 50;

  const highlightCode = (code) => {
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const pattern = /(\/\/.*$)|(["'`])(?:(?!\2)[^\\]|\\.)*?\2|\b(const|let|var|await|async|import|from|export|return|if|else|function|class|new|throw|try|catch)\b|\.([a-zA-Z_][a-zA-Z0-9_]*)\b|\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/gm;

    return escaped.replace(pattern, (match, comment, stringQuote, keyword, property, func) => {
      if (comment) return `<span style="color:#6b7280;font-style:italic">${match}</span>`;
      if (stringQuote) return `<span style="color:#059669">${match}</span>`;
      if (keyword) return `<span style="color:#db2777">${match}</span>`;
      if (property) return `.<span style="color:#0891b2">${property}</span>`;
      if (func) return `<span style="color:#2563eb">${match}</span>`;
      return match;
    });
  };

  // Smooth animation to target value
  const animateTo = (target) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    setIsAnimating(true);
    const start = sliderPercent;
    const startTime = performance.now();
    const duration = 400; // ms

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      setSliderPercent(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setSliderPercent(target);
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleToggle = () => {
    animateTo(isLightMode ? 0 : 100);
  };

  const handleMouseDown = (e) => {
    if (isAnimating) {
      cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
    }
    e.preventDefault();
    setIsDragging(true);
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
    if (isAnimating) {
      cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPercent(percent);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setSliderPercent((p) => Math.max(0, p - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPercent((p) => Math.min(100, p + 5));
    }
  };

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

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      <div
        className="rounded-3xl not-prose mt-4 backdrop-blur-xl border overflow-hidden"
        style={{
          fontFamily: 'Inter, sans-serif',
          borderColor: '#d4d4d8',
        }}
      >
        {/* Header with toggle */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{
            background: 'linear-gradient(to bottom, #f8f9fa, #f1f3f4)',
            borderColor: '#e4e4e7',
          }}
        >
          <span
            className="text-sm font-medium"
            style={{
              color: '#52525b',
            }}
          >
            {isLightMode ? secondLabel : firstLabel}
          </span>

          {/* Neumorphic Toggle Switch */}
          <div
            onClick={handleToggle}
            style={{
              position: 'relative',
              width: '56px',
              height: '28px',
              background: '#e0e0e0',
              borderRadius: '14px',
              boxShadow: 'inset -2px -2px 4px #ffffff, inset 2px 2px 4px #b0b0b0',
              cursor: 'pointer',
              transition: 'background 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            {/* Toggle button */}
            <div
              style={{
                position: 'absolute',
                width: '24px',
                height: '24px',
                background: 'linear-gradient(145deg, #f5f5f5, #e0e0e0)',
                borderRadius: '12px',
                top: '2px',
                left: isLightMode ? '30px' : '2px',
                boxShadow: '-2px -2px 4px #ffffff, 2px 2px 4px #b0b0b0',
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* LED */}
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  background: isLightMode ? '#0066ff' : '#999',
                  borderRadius: '50%',
                  boxShadow: isLightMode
                    ? '0 0 8px 2px #0066ff'
                    : '0 0 4px 1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Code container */}
        <div
          ref={containerRef}
          className="p-0"
          style={{ cursor: isDragging ? "grabbing" : "default" }}
          onTouchMove={handleTouchMove}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuenow={sliderPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Code comparison slider"
        >
          <div className="relative" style={{ minHeight: "140px", overflowX: "auto" }}>
            <div style={{ display: "grid" }}>
              {/* First code (background) */}
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
                dangerouslySetInnerHTML={{ __html: highlightCode(firstCode) }}
              />

              {/* Second code (foreground) with clip-path */}
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
                dangerouslySetInnerHTML={{ __html: highlightCode(secondCode) }}
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
              <div className="absolute top-0 bottom-0 w-px bg-zinc-400 dark:bg-white/30" />

              <div
                className="absolute top-0 bottom-0"
                style={{
                  right: "50%",
                  width: "80px",
                  background: "linear-gradient(to left, rgba(0, 102, 255, 0.15) 0%, transparent 100%)",
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
                <div className="flex flex-col gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#0066ff' }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#0066ff' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
