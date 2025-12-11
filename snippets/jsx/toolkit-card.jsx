export const ToolkitCard = ({ title, description, href, items }) => {
  return (
    <a href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden mb-4 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
        style={{ display: 'flex' }}
      >
        <div style={{ flex: 1, padding: '1.5rem', borderRight: '1px solid rgba(128,128,128,0.2)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</div>
          <div style={{ color: 'var(--tw-prose-body)', opacity: 0.8 }}>{description}</div>
        </div>
        <div style={{ flex: 1, padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', opacity: 0.7 }}>What's inside</div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
            {items.map((item, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>)}
          </ul>
        </div>
      </div>
    </a>
  );
};
