// CSS is defined in /style.css (loaded in <head>) to prevent FOUC
// Do NOT add inline <style> tags here - they render in <body> and cause flash

export const LiquidGlassPill = ({ children }) => {
  return (
    <div className="lgp-wrapper">
      <div className="lgp-glass">
        <span className="lgp-inner-rim" />
      </div>
      <div className="lgp-content">
        {children}
      </div>
    </div>
  );
};
