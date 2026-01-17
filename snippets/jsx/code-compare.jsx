export const CodeCompare = ({
  firstCode = "",
  secondCode = "",
  firstLabel = "Light Token",
  secondLabel = "SPL",
  language = "javascript",
}) => {
  const [sliderPercent, setSliderPercent] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // When slider is on the right (100%), show first code; on left (0%), show second code
  const showingFirst = sliderPercent > 50;

  const handleCopy = async () => {
    const codeToCopy = showingFirst ? firstCode : secondCode;
    await navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (code) => {
    let escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (language === "rust") {
      // Rust syntax highlighting
      const rustPattern =
        /(\/\/.*$)|(["'])(?:(?!\2)[^\\]|\\.)*?\2|\b(use|let|mut|pub|fn|struct|impl|enum|mod|const|static|trait|type|where|for|in|if|else|match|loop|while|return|self|Self|true|false|Some|None|Ok|Err|Result|Option|vec!)\b|::([a-zA-Z_][a-zA-Z0-9_]*)|&amp;([a-zA-Z_][a-zA-Z0-9_]*)|\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()|(\?)/gm;

      return escaped.replace(rustPattern, (match, comment, stringQuote, keyword, pathSegment, reference, func, questionMark) => {
        if (comment) return `<span style="color:#6b7280;font-style:italic">${match}</span>`;
        if (stringQuote) return `<span style="color:#059669">${match}</span>`;
        if (keyword) return `<span style="color:#db2777">${match}</span>`;
        if (pathSegment) return `::<span style="color:#0891b2">${pathSegment}</span>`;
        if (reference) return `&amp;<span style="color:#6366f1">${reference}</span>`;
        if (func) return `<span style="color:#2563eb">${match}</span>`;
        if (questionMark) return `<span style="color:#db2777">?</span>`;
        return match;
      });
    }

    // JavaScript/TypeScript syntax highlighting (default)
    const pattern =
      /(\/\/.*$)|(["'`])(?:(?!\2)[^\\]|\\.)*?\2|\b(const|let|var|await|async|import|from|export|return|if|else|function|class|new|throw|try|catch)\b|\.([a-zA-Z_][a-zA-Z0-9_]*)\b|\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/gm;

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
    animateTo(showingFirst ? 0 : 100);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        className="rounded-3xl not-prose mt-4 backdrop-blur-xl border overflow-hidden border-zinc-300 dark:border-zinc-700"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Header with toggle */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
        >
          <span
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300"
          >
            {showingFirst ? firstLabel : secondLabel}
          </span>

          <div className="flex items-center gap-3">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500 dark:text-zinc-400"
              title="Copy code"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
            >
              {copied ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {/* Neumorphic Toggle Switch */}
            <div
              onClick={handleToggle}
              className="bg-zinc-200 dark:bg-zinc-600"
              style={{
                position: "relative",
                width: "56px",
                height: "28px",
                borderRadius: "14px",
                boxShadow: "inset -2px -2px 4px rgba(255,255,255,0.3), inset 2px 2px 4px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
            {/* Toggle button */}
            <div
              className="bg-white dark:bg-zinc-300"
              style={{
                position: "absolute",
                width: "24px",
                height: "24px",
                borderRadius: "12px",
                top: "2px",
                left: showingFirst ? "30px" : "2px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease-in-out",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* LED */}
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  background: showingFirst ? "#0066ff" : "#999",
                  borderRadius: "50%",
                  boxShadow: showingFirst ? "0 0 5px 1px rgba(0, 102, 255, 0.6)" : "0 0 4px 1px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                }}
              />
            </div>
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
          <div className="relative" style={{ minHeight: "140px", overflow: "hidden" }}>
            <div style={{ display: "grid" }}>
              {/* Second code (background) - shown when slider is on left */}
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

              {/* First code (foreground) with clip-path - revealed when slider moves right */}
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
              <div className="absolute top-0 bottom-0 w-px bg-zinc-400 dark:bg-white/30" />

              <div
                className="absolute top-0 bottom-0"
                style={{
                  right: "50%",
                  width: "60px",
                  background:
                    "linear-gradient(to left, rgba(0, 102, 255, 0.08) 0%, transparent 100%)",
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
                      style={{
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: "#0066ff",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        background: "#0066ff",
                      }}
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
