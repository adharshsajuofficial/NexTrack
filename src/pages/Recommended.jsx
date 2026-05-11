export default function Recommended() {
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
      <div style={{ fontSize: '3rem' }}>✨</div>
      <h3>Looking for recommendations?</h3>
      <p>We're analyzing your profile to find the best matches for you.</p>
    </div>
  );
}

