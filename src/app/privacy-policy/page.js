'use client';

export default function PrivacyPolicy() {
  return (
    <article style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '60px 20px',
      color: '#eaeaea',
      lineHeight: '1.8'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        color: '#d4af37',
        marginBottom: '40px',
        background: 'linear-gradient(135deg, #d4af37, #e6c054)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Privacy Policy
      </h1>

      <p style={{ color: '#999', marginBottom: '30px' }}>
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>1. Introduction</h2>
        <p>
          Bravant Movers & Cleaners ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information in connection with our website and services.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>2. Information We Collect</h2>
        <p>We may collect various types of information in connection with the services we provide, including:</p>
        <ul style={{ marginLeft: '20px', marginTop: '15px' }}>
          <li style={{ marginBottom: '10px' }}>Personal identification information (e.g., name, email, phone number, address)</li>
          <li style={{ marginBottom: '10px' }}>Business information (e.g., company name, business address)</li>
          <li style={{ marginBottom: '10px' }}>Service preferences and history</li>
          <li style={{ marginBottom: '10px' }}>Payment and billing information</li>
          <li style={{ marginBottom: '10px' }}>Communication records and correspondence</li>
          <li style={{ marginBottom: '10px' }}>Device and usage data (e.g., IP address, browser type, pages visited)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>3. How We Use Your Information</h2>
        <p>We use the information we collect for various purposes, including:</p>
        <ul style={{ marginLeft: '20px', marginTop: '15px' }}>
          <li style={{ marginBottom: '10px' }}>Providing and improving our moving and cleaning services</li>
          <li style={{ marginBottom: '10px' }}>Processing payments and managing accounts</li>
          <li style={{ marginBottom: '10px' }}>Communicating with you about services, updates, and changes</li>
          <li style={{ marginBottom: '10px' }}>Responding to inquiries and providing customer support</li>
          <li style={{ marginBottom: '10px' }}>Conducting marketing and promotional activities</li>
          <li style={{ marginBottom: '10px' }}>Analyzing usage patterns to enhance user experience</li>
          <li style={{ marginBottom: '10px' }}>Complying with legal obligations and resolving disputes</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>4. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us understand how you interact with our site, remember your preferences, and deliver targeted content. You can control cookie settings through your browser.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>5. Third-Party Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your consent, except as necessary to provide our services or as required by law. We may share information with:
        </p>
        <ul style={{ marginLeft: '20px', marginTop: '15px' }}>
          <li style={{ marginBottom: '10px' }}>Service providers assisting with our operations</li>
          <li style={{ marginBottom: '10px' }}>Law enforcement when required by law</li>
          <li style={{ marginBottom: '10px' }}>Business partners with your consent</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is entirely secure.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>7. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul style={{ marginLeft: '20px', marginTop: '15px' }}>
          <li style={{ marginBottom: '10px' }}>The right to access your information</li>
          <li style={{ marginBottom: '10px' }}>The right to correct inaccurate information</li>
          <li style={{ marginBottom: '10px' }}>The right to request deletion of your information</li>
          <li style={{ marginBottom: '10px' }}>The right to opt-out of marketing communications</li>
        </ul>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>8. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our privacy practices, please contact us at:
        </p>
        <p style={{ marginTop: '15px' }}>
          <strong>Email:</strong> bravantmovers.m@gmail.com<br />
          <strong>Phone:</strong> +254 710 166873<br />
          <strong>Location:</strong> Nairobi, Kenya
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>9. Policy Changes</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this policy.
        </p>
      </section>
    </article>
  );
}
