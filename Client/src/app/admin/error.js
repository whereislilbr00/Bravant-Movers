'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Something went wrong</h2>
        <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #d4af37, #e6b800)',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
