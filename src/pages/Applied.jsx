export default function Applied() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      color: 'var(--text-secondary)',
      gap: '1rem'
    }}>
      <div style={{ fontSize: '3rem' }}>📁</div>
      <h3>No applications yet</h3>
      <p>Keep track of your journey. Your applied opportunities will appear here.</p>
    </div>
  );
}

