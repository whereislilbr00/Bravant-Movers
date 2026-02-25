'use client';

import { useState } from 'react';

export default function QuoteForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="quote-form-container">
      <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="moveType">Move Type</label>
            <select id="moveType" name="moveType" required>
              <option value="local">Local Move</option>
              <option value="long-distance">Long Distance</option>
              <option value="packing-only">Packing Only</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="propertyType">Property Type</label>
            <select id="propertyType" name="propertyType" required>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="office">Office</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <select id="bedrooms" name="bedrooms" required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Get Quote
        </button>
      </form>

      {submitted && (
        <div className="quote-result">
          <h3>Quote Request Received!</h3>
          <p>We'll contact you shortly with a detailed quote.</p>
        </div>
      )}
    </div>
  );
}
