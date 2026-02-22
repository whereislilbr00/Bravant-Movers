'use client';

import { useEffect } from 'react';

export default function CookieConsent() {
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after small delay
      const timer = setTimeout(() => {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
          banner.style.display = 'block';
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookie-banner').style.display = 'none';
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookie-banner').style.display = 'none';
  };

  return (
    <div id="cookie-banner" style={{
      display: 'none',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f5f6f7',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      padding: '20px',
      zIndex: 1000,
      animation: 'slideUp 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <p style={{
          color: '#7f8c8d',
          margin: 0,
          fontSize: '0.95rem',
          flex: '1',
          minWidth: '200px'
        }}>
          We use cookies to enhance your experience. By accepting, you consent to our use of cookies.{' '}
          <a href="/privacy-policy" style={{ color: '#d4af37', textDecoration: 'none' }}>Learn more</a>
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={declineCookies}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: '#d4af37',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(212, 175, 55, 0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #d4af37, #e6c054)',
              border: 'none',
              color: '#1a1a2e',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: '0.9rem'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}