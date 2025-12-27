// Styles in style.css - uses .glass-pill classes

export const LiquidGlassPill = ({ title }) => {
  return (
    <div className="glass-pill">
      <div className="glass-pill-bg">
        <span className="glass-pill-inner" />
      </div>
      <div className="glass-pill-content">
        <h1 className="text-4xl md:text-5xl font-medium text-gray-900 m-0">
          {title}
        </h1>
      </div>
    </div>
  );
};
