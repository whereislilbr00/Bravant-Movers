'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Checkout() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Plan';
  const price = searchParams.get('price') || '0';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan,
          price,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    }
  };

  const priceNum = parseInt(price.replace(/,/g, '')) || 0;
  const tax = Math.round(priceNum * 0.16);
  const total = priceNum + tax;

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#eaeaea',
      }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px',
          }}>
            ✓
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            color: '#d4af37',
            marginBottom: '10px',
          }}>
            Payment Successful!
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#b0b0b0', marginBottom: '20px' }}>
            Your booking for {plan} has been confirmed.
          </p>
          <p style={{ color: '#999' }}>Redirecting to home...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
      padding: '100px 20px 60px',
      color: '#eaeaea',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '40px', textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: '2.5rem',
            color: '#d4af37',
            marginBottom: '10px',
          }}>
            Checkout
          </h1>
          <p style={{ color: '#b0b0b0' }}>Complete your booking for <strong>{plan}</strong></p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '40px',
        }}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '20px',
              padding: '40px',
            }}
          >
            <h2 style={{ marginBottom: '30px', color: '#d4af37' }}>Billing Information</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#eaeaea',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#eaeaea',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#eaeaea',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#eaeaea',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#eaeaea',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <h2 style={{ marginBottom: '30px', marginTop: '40px', color: '#d4af37' }}>Payment Information</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                maxLength="19"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  color: '#eaeaea',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px',
                    color: '#eaeaea',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  maxLength="4"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(212, 175, 55, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: '8px',
                    color: '#eaeaea',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #d4af37, #e6b800)',
                color: '#1a1a2e',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Complete Payment
            </motion.button>

            <Link href="/">
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#b0b0b0', cursor: 'pointer' }}>
                &larr; Back to Home
              </p>
            </Link>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '20px',
              padding: '30px',
              height: 'fit-content',
              position: 'sticky',
              top: '120px',
            }}
          >
            <h3 style={{ marginBottom: '20px', color: '#d4af37' }}>Order Summary</h3>
            <div style={{
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              marginBottom: '20px',
            }}>
              <p style={{ color: '#b0b0b0', marginBottom: '8px' }}>Plan</p>
              <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#d4af37' }}>
                {plan}
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#b0b0b0' }}>Subtotal</span>
                <span style={{ color: '#eaeaea' }}>KES {priceNum.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ color: '#b0b0b0' }}>Tax (16%)</span>
                <span style={{ color: '#eaeaea' }}>KES {tax.toLocaleString()}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid rgba(212, 175, 55, 0.2)',
              }}>
                <span style={{ fontWeight: '700' }}>Total</span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#d4af37',
                }}>
                  KES {total.toLocaleString()}
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.85rem',
              color: '#999',
              textAlign: 'center',
            }}>
              💳 Your payment is secure and encrypted
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
