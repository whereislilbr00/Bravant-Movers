'use client';

import { useState } from 'react';

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="booking-form-container">
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-grid">
          {/* Customer Information */}
          <div className="form-group">
            <label htmlFor="customerName">Full Name</label>
            <input type="text" id="customerName" name="customerName" required />
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Email</label>
            <input type="email" id="customerEmail" name="customerEmail" required />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Phone</label>
            <input type="tel" id="customerPhone" name="customerPhone" required />
          </div>

          {/* Move Details */}
          <div className="form-group">
            <label htmlFor="moveDate">Move Date</label>
            <input type="date" id="moveDate" name="moveDate" required />
          </div>

          <div className="form-group">
            <label htmlFor="moveTime">Preferred Time</label>
            <input type="time" id="moveTime" name="moveTime" required />
          </div>

          <div className="form-group">
            <label htmlFor="moveType">Move Type</label>
            <select id="moveType" name="moveType" required>
              <option value="local">Local Move</option>
              <option value="long-distance">Long Distance</option>
              <option value="packing-only">Packing Only</option>
            </select>
          </div>

          {/* Pickup Address */}
          <div className="form-group full-width">
            <label htmlFor="pickupStreet">Pickup Address</label>
            <input type="text" id="pickupStreet" name="pickupStreet" placeholder="Street" required />
          </div>

          <div className="form-group">
            <input type="text" name="pickupCity" placeholder="City" required />
          </div>

          <div className="form-group">
            <input type="text" name="pickupState" placeholder="State" required />
          </div>

          <div className="form-group">
            <input type="text" name="pickupZip" placeholder="Zip Code" required />
          </div>

          {/* Delivery Address */}
          <div className="form-group full-width">
            <label htmlFor="deliveryStreet">Delivery Address</label>
            <input type="text" id="deliveryStreet" name="deliveryStreet" placeholder="Street" required />
          </div>

          <div className="form-group">
            <input type="text" name="deliveryCity" placeholder="City" required />
          </div>

          <div className="form-group">
            <input type="text" name="deliveryState" placeholder="State" required />
          </div>

          <div className="form-group">
            <input type="text" name="deliveryZip" placeholder="Zip Code" required />
          </div>

          {/* Property Details */}
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

          {/* Additional Services */}
          <div className="form-group checkbox-group" style={{ gridColumn: '1 / -1' }}>
            <label className="checkbox-label">
              <input type="checkbox" name="packingService" />
              <span>Packing Service</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="cleaningService" />
              <span>Cleaning Service</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="deepCleaning" />
              <span>Deep Cleaning</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="fragileItemsHandling" />
              <span>Fragile Items Handling</span>
            </label>
          </div>

          {/* Special Instructions */}
          <div className="form-group full-width">
            <label htmlFor="specialInstructions">Special Instructions</label>
            <textarea id="specialInstructions" name="specialInstructions" rows="4"></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Book Now
        </button>
      </form>

      {submitted && (
        <div className="quote-result">
          <h3>Booking Request Submitted!</h3>
          <p>Thank you! We'll contact you shortly to confirm your booking.</p>
        </div>
      )}
    </div>
  );
}
