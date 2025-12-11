export const ToolkitCard = ({ title, description, href, items }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '1rem', borderBottom: 'none', boxShadow: 'none' }}
      className="no-underline"
    >
      <div
        style={{
          display: 'flex',
          border: isHovered ? '2px solid #0066ff' : '2px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{
          flex: 1,
          padding: '1.5rem',
          borderRight: '2px solid #ccc',
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</div>
          <div style={{ opacity: 0.8 }}>{description}</div>
        </div>
        <div style={{ flex: 1, padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.7 }}>What's inside</div>
          {items && items.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
              {items.map((item, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>)}
            </ul>
          ) : (
            <div style={{ fontSize: '0.875rem', opacity: 0.5, fontStyle: 'italic' }}>Coming soon</div>
          )}
        </div>
      </div>
    </a>
  );
};
