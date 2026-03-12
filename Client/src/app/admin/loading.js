'use client';

export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px' 
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(212, 175, 55, 0.2)',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={{ color: '#d4af37', fontSize: '1.2rem' }}>Loading Dashboard...</div>
      </div>
    </div>
  );
}
