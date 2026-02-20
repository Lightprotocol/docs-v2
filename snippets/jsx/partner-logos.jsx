// Styles in style.css - uses .partner-logos classes

export const PartnerLogos = () => {
  return (
    <div className="partner-logos">
      <img
        src="/images/light-wordmark.svg"
        alt="Light Protocol"
        className="partner-logo light-wordmark"
      />
      <span className="partner-divider">×</span>
      <img
        src="/images/helius-black.png"
        alt="Helius"
        className="partner-logo logo-light"
      />
      <img
        src="/images/helius-white.png"
        alt="Helius"
        className="partner-logo logo-dark"
      />
    </div>
  );
};
