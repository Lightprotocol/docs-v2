// Styles in style.css - uses .glass-pill classes

export const LiquidGlassPill = ({ title, children }) => {
  return (
    <div className="glass-pill">
      <div className="glass-pill-bg">
        <span className="glass-pill-inner" />
      </div>
      <div className="glass-pill-content">
        <h1 className="hero-title">{title}</h1>
        {children}
      </div>
    </div>
  );
};
