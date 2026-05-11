export default function Shortlisted() {
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
      <div style={{ fontSize: '3rem' }}>⭐</div>
      <h3>Your shortlist is empty</h3>
      <p>Save opportunities you're interested in to view them later.</p>
    </div>
  );
}

