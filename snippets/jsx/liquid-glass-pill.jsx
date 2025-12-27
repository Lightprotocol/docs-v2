// ALL STYLES INLINE - no external CSS needed, no flash possible
// Inline styles are part of the HTML attributes and render immediately

export const LiquidGlassPill = ({ children }) => {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
    }}>
      <div style={{
        position: 'absolute',
        inset: '-12px -40px',
        zIndex: 0,
        borderRadius: '9999px',
        overflow: 'hidden',
        background: 'transparent',
        backdropFilter: 'blur(1px) saturate(120%)',
        WebkitBackdropFilter: 'blur(1px) saturate(120%)',
        border: '1px solid rgba(255, 255, 255, 0.35)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
      }}>
        <span style={{
          position: 'absolute',
          inset: '1px',
          borderRadius: 'inherit',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          background: 'transparent',
          pointerEvents: 'none',
        }} />
      </div>
      <div style={{
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
};
