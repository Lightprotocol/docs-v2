export const LiquidGlassPill = ({ children }) => {
  const uniqueId = 'lgp-' + Math.random().toString(36).substr(2, 9);

  return (
    <>
      <style>
        {`
          .${uniqueId}-wrapper {
            position: relative;
            display: inline-block;
          }

          .${uniqueId}-glass {
            position: absolute;
            inset: -12px -40px;
            z-index: 0;
            border-radius: 9999px;
            overflow: hidden;

            /* COMPLETELY TRANSPARENT - no fill */
            background: transparent;

            /* Very light blur - preserves SVG detail while adding subtle glass refraction */
            backdrop-filter: blur(1px) saturate(120%);
            -webkit-backdrop-filter: blur(1px) saturate(120%);

            /* Bright outer rim */
            border: 1px solid rgba(255, 255, 255, 0.35);

            /* Subtle drop shadow only - no heavy inset shadows */
            box-shadow:
              0 4px 20px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.25);
          }

          /* Inner rim - border only, no fill */
          .${uniqueId}-inner-rim {
            position: absolute;
            inset: 1px;
            border-radius: inherit;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: transparent;
            pointer-events: none;
          }

          /* Edge highlight - top/left corner only */
          .${uniqueId}-glass::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.20) 0%,
              transparent 30%,
              transparent 100%
            );
            pointer-events: none;
          }

          /* Bottom edge shadow - subtle edge definition */
          .${uniqueId}-glass::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(
              to bottom,
              transparent 70%,
              rgba(0, 0, 0, 0.06) 100%
            );
            pointer-events: none;
          }

          .${uniqueId}-content {
            position: relative;
            z-index: 1;
          }
        `}
      </style>
      <div className={`${uniqueId}-wrapper`}>
        <div className={`${uniqueId}-glass`}>
          <span className={`${uniqueId}-inner-rim`} />
        </div>
        <div className={`${uniqueId}-content`}>
          {children}
        </div>
      </div>
    </>
  );
};
