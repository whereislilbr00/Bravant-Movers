'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Calendar, MapPin, Home, Package, Shield, Check, Loader2 } from 'lucide-react';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Customer Info
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // Service Type
    moveType: 'local',
    
    // Move Details
    moveDate: '',
    moveTime: '',
    
    // Pickup Address
    pickupStreet: '',
    pickupCity: '',
    pickupState: '',
    pickupZip: '',
    
    // Delivery Address
    deliveryStreet: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    
    // Property Details
    propertyType: 'house',
    bedrooms: 1,
    floors: 1,
    hasElevator: false,
    hasStairs: false,
    
    // Additional Services
    packingService: false,
    cleaningService: false,
    deepCleaning: false,
    furnitureDisassembly: false,
    fragileItemsHandling: false,
    
    // Insurance
    insuranceLevel: 'basic',
    
    // Special Instructions
    specialInstructions: ''
  });

  // Use useMemo to calculate price without triggering re-renders during render
  const estimatedPrice = useMemo(() => {
    let price = 99; // Base rate
    
    // Move type pricing
    if (formData.moveType === 'local') price += 99;
    else if (formData.moveType === 'long-distance') price += 299;
    else if (formData.moveType === 'packing-only') price += 99;
    else if (formData.moveType === 'unpacking-only') price += 99;
    else if (formData.moveType === 'storage') price += 149;
    else if (formData.moveType === 'cleaning-service') price += 149;
    
    // Bedrooms
    price += (formData.bedrooms || 1) * 50;
    
    // Floors (if no elevator and more than 1 floor)
    if (!formData.hasElevator && formData.floors > 1) {
      price += (formData.floors - 1) * 25;
    }
    
    // Additional services
    if (formData.packingService) price += 150;
    if (formData.cleaningService) price += 120;
    if (formData.deepCleaning) price += 250;
    if (formData.furnitureDisassembly) price += 75;
    if (formData.fragileItemsHandling) price += 50;
    
    // Insurance
    if (formData.insuranceLevel === 'standard') price += 50;
    if (formData.insuranceLevel === 'premium') price += 100;
    
    return price;
  }, [
    formData.moveType, 
    formData.bedrooms, 
    formData.floors, 
    formData.hasElevator,
    formData.packingService,
    formData.cleaningService,
    formData.deepCleaning,
    formData.furnitureDisassembly,
    formData.fragileItemsHandling,
    formData.insuranceLevel
  ]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // Validate Step 1 - Customer & Service Details
  const validateStep1 = useCallback(() => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full Name is required';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone Number is required';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email Address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    if (!formData.moveDate) {
      newErrors.moveDate = 'Move Date is required';
    }
    if (!formData.moveTime) {
      newErrors.moveTime = 'Preferred Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Validate Step 2 - Addresses
  const validateStep2 = useCallback(() => {
    const newErrors = {};
    if (!formData.pickupStreet.trim()) {
      newErrors.pickupStreet = 'Pickup Street Address is required';
    }
    if (!formData.pickupCity.trim()) {
      newErrors.pickupCity = 'Pickup City is required';
    }
    if (!formData.pickupState.trim()) {
      newErrors.pickupState = 'Pickup State is required';
    }
    if (!formData.pickupZip.trim()) {
      newErrors.pickupZip = 'Pickup ZIP Code is required';
    }
    if (!formData.deliveryStreet.trim()) {
      newErrors.deliveryStreet = 'Delivery Street Address is required';
    }
    if (!formData.deliveryCity.trim()) {
      newErrors.deliveryCity = 'Delivery City is required';
    }
    if (!formData.deliveryState.trim()) {
      newErrors.deliveryState = 'Delivery State is required';
    }
    if (!formData.deliveryZip.trim()) {
      newErrors.deliveryZip = 'Delivery ZIP Code is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = useCallback(() => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!validateStep1()) {
        return; // Don't proceed if validation fails
      }
    } else if (step === 2) {
      if (!validateStep2()) {
        return; // Don't proceed if validation fails
      }
    }
    setStep(prev => prev + 1);
    setErrors({});
  }, [step, validateStep1, validateStep2]);

  const prevStep = useCallback(() => {
    setStep(prev => prev - 1);
    setErrors({});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double-check all required fields
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || 
        !formData.customerPhone.trim() || !formData.moveDate || !formData.moveTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    const bookingData = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      moveType: formData.moveType,
      moveDate: formData.moveDate,
      moveTime: formData.moveTime,
      pickupAddress: {
        street: formData.pickupStreet,
        city: formData.pickupCity,
        state: formData.pickupState,
        zipCode: formData.pickupZip
      },
      deliveryAddress: {
        street: formData.deliveryStreet,
        city: formData.deliveryCity,
        state: formData.deliveryState,
        zipCode: formData.deliveryZip
      },
      propertyType: formData.propertyType,
      bedrooms: formData.bedrooms,
      floors: formData.floors,
      hasElevator: formData.hasElevator,
      hasStairs: formData.hasStairs,
      packingService: formData.packingService,
      cleaningService: formData.cleaningService,
      deepCleaning: formData.deepCleaning,
      furnitureDisassembly: formData.furnitureDisassembly,
      fragileItemsHandling: formData.fragileItemsHandling,
      insuranceLevel: formData.insuranceLevel,
      specialInstructions: formData.specialInstructions,
      totalPrice: estimatedPrice,
      status: 'pending',
      paymentStatus: 'unpaid'
    };

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setShowConfirmDialog(false);
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Error:', err);
      // For demo purposes, show success even if API is not available
      alert('Demo Mode: In a real environment, this would submit to the server. Please make sure the backend is running at port 5000 for actual bookings.');
      setSubmitted(true);
      setShowConfirmDialog(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input style helper
  const getInputStyle = (fieldName) => ({
    ...inputStyle,
    borderColor: errors[fieldName] ? '#ef4444' : 'rgba(212, 175, 55, 0.2)'
  });

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
        padding: '40px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '24px',
          padding: '50px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #34d399)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Check size={40} color="#1a1a2e" />
          </div>
          <h2 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '16px' }}>
            Booking Submitted!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '8px' }}>
            Thank you for choosing Bravant Movers!
          </p>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            We have received your booking request. Our team will contact you shortly to confirm your move.
          </p>
          <div style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <p style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: '700' }}>
              Estimated Price: KES {estimatedPrice.toLocaleString()}
            </p>
          </div>
          <Link href="/">
            <button style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #d4af37, #e6b800)',
              border: 'none',
              borderRadius: '12px',
              color: '#1a1a2e',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}>
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            textDecoration: 'none',
            marginBottom: '20px',
            fontSize: '0.95rem'
          }}>
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          
          <div style={{
            width: '70px',
            height: '70px',
            background: 'linear-gradient(135deg, #d4af37, #e6b800)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
          }}>
            <Truck size={36} color="#1a1a2e" />
          </div>
          
          <h1 style={{ color: '#d4af37', fontSize: '2.2rem', marginBottom: '10px', fontWeight: '700' }}>
            Book Your Move
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Fill in the details below and we'll provide you with a free quote
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: step >= s ? 'linear-gradient(135deg, #d4af37, #e6b800)' : 'rgba(255, 255, 255, 0.1)',
                border: step >= s ? 'none' : '2px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: step >= s ? '#1a1a2e' : '#64748b',
                fontWeight: '700',
                fontSize: '0.9rem'
              }}>
                {s}
              </div>
              <span style={{
                color: step >= s ? '#e2e8f0' : '#64748b',
                fontSize: '0.9rem',
                fontWeight: step === s ? '600' : '400'
              }}>
                {s === 1 ? 'Details' : s === 2 ? 'Address' : 'Services'}
              </span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '20px',
          padding: '30px'
        }}>
          
          {/* Step 1: Customer & Service Details */}
          {step === 1 && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <h3 style={{ color: '#d4af37', fontSize: '1.2rem', marginBottom: '10px' }}>
                <Calendar size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Service & Customer Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    style={getInputStyle('customerName')}
                  />
                  {errors.customerName && <span style={errorStyle}>{errors.customerName}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    style={getInputStyle('customerPhone')}
                  />
                  {errors.customerPhone && <span style={errorStyle}>{errors.customerPhone}</span>}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  style={getInputStyle('customerEmail')}
                />
                {errors.customerEmail && <span style={errorStyle}>{errors.customerEmail}</span>}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Service Type *
                  </label>
                  <select
                    name="moveType"
                    value={formData.moveType}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="local">Local Move</option>
                    <option value="long-distance">Long Distance</option>
                    <option value="packing-only">Packing Only</option>
                    <option value="unpacking-only">Unpacking Only</option>
                    <option value="storage">Storage</option>
                    <option value="cleaning-service">Cleaning Service</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="office">Office</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Move Date *
                  </label>
                  <input
                    type="date"
                    name="moveDate"
                    value={formData.moveDate}
                    onChange={handleChange}
                    style={getInputStyle('moveDate')}
                  />
                  {errors.moveDate && <span style={errorStyle}>{errors.moveDate}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    name="moveTime"
                    value={formData.moveTime}
                    onChange={handleChange}
                    style={getInputStyle('moveTime')}
                  />
                  {errors.moveTime && <span style={errorStyle}>{errors.moveTime}</span>}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    Floors
                  </label>
                  <input
                    type="number"
                    name="floors"
                    value={formData.floors}
                    onChange={handleChange}
                    min="1"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                    &nbsp;
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="hasElevator"
                      checked={formData.hasElevator}
                      onChange={handleChange}
                    />
                    Has Elevator
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Addresses */}
          {step === 2 && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <h3 style={{ color: '#d4af37', fontSize: '1.2rem', marginBottom: '10px' }}>
                <MapPin size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Pickup & Delivery Addresses
              </h3>
              
              <div>
                <h4 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>Pickup Address</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    name="pickupStreet"
                    value={formData.pickupStreet}
                    onChange={handleChange}
                    placeholder="Street Address"
                    style={getInputStyle('pickupStreet')}
                  />
                  {errors.pickupStreet && <span style={errorStyle}>{errors.pickupStreet}</span>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      name="pickupCity"
                      value={formData.pickupCity}
                      onChange={handleChange}
                      placeholder="City"
                      style={getInputStyle('pickupCity')}
                    />
                    <input
                      type="text"
                      name="pickupState"
                      value={formData.pickupState}
                      onChange={handleChange}
                      placeholder="State"
                      style={getInputStyle('pickupState')}
                    />
                    <input
                      type="text"
                      name="pickupZip"
                      value={formData.pickupZip}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      style={getInputStyle('pickupZip')}
                    />
                  </div>
                  {errors.pickupCity && <span style={errorStyle}>{errors.pickupCity}</span>}
                  {errors.pickupState && <span style={errorStyle}>{errors.pickupState}</span>}
                  {errors.pickupZip && <span style={errorStyle}>{errors.pickupZip}</span>}
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>Delivery Address</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <input
                    type="text"
                    name="deliveryStreet"
                    value={formData.deliveryStreet}
                    onChange={handleChange}
                    placeholder="Street Address"
                    style={getInputStyle('deliveryStreet')}
                  />
                  {errors.deliveryStreet && <span style={errorStyle}>{errors.deliveryStreet}</span>}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      name="deliveryCity"
                      value={formData.deliveryCity}
                      onChange={handleChange}
                      placeholder="City"
                      style={getInputStyle('deliveryCity')}
                    />
                    <input
                      type="text"
                      name="deliveryState"
                      value={formData.deliveryState}
                      onChange={handleChange}
                      placeholder="State"
                      style={getInputStyle('deliveryState')}
                    />
                    <input
                      type="text"
                      name="deliveryZip"
                      value={formData.deliveryZip}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      style={getInputStyle('deliveryZip')}
                    />
                  </div>
                  {errors.deliveryCity && <span style={errorStyle}>{errors.deliveryCity}</span>}
                  {errors.deliveryState && <span style={errorStyle}>{errors.deliveryState}</span>}
                  {errors.deliveryZip && <span style={errorStyle}>{errors.deliveryZip}</span>}
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Additional Services */}
          {step === 3 && (
            <div style={{ display: 'grid', gap: '24px' }}>
              <h3 style={{ color: '#d4af37', fontSize: '1.2rem', marginBottom: '10px' }}>
                <Package size={20} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                Additional Services & Insurance
              </h3>
              
              <div>
                <h4 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>Additional Services</h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { name: 'packingService', label: 'Packing Service', price: 'KES 150' },
                    { name: 'cleaningService', label: 'Cleaning Service', price: 'KES 120' },
                    { name: 'deepCleaning', label: 'Deep Cleaning', price: 'KES 250' },
                    { name: 'furnitureDisassembly', label: 'Furniture Disassembly', price: 'KES 75' },
                    { name: 'fragileItemsHandling', label: 'Fragile Items Handling', price: 'KES 50' },
                  ].map((service) => (
                    <label key={service.name} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: formData[service.name] ? '2px solid #d4af37' : '2px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          name={service.name}
                          checked={formData[service.name]}
                          onChange={handleChange}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{service.label}</span>
                      </div>
                      <span style={{ color: '#d4af37', fontWeight: '600' }}>{service.price}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 style={{ color: '#e2e8f0', marginBottom: '16px', fontSize: '1rem' }}>
                  <Shield size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Insurance Level
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { value: 'basic', label: 'Basic Coverage', price: 'Included' },
                    { value: 'standard', label: 'Standard Coverage', price: 'KES 50' },
                    { value: 'premium', label: 'Premium Coverage', price: 'KES 100' },
                  ].map((insurance) => (
                    <label key={insurance.value} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: formData.insuranceLevel === insurance.value ? '2px solid #d4af37' : '2px solid rgba(212, 175, 55, 0.2)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="radio"
                          name="insuranceLevel"
                          value={insurance.value}
                          checked={formData.insuranceLevel === insurance.value}
                          onChange={handleChange}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>{insurance.label}</span>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>{insurance.price}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special requirements or details we should know..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Price Summary */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '10px'
              }}>
                <p style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: '700', textAlign: 'center' }}>
                  Estimated Price: KES {estimatedPrice.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  border: '2px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Back
              </button>
            ) : (
              <div />
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #d4af37, #e6b800)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#1a1a2e',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmDialog(true)}
                disabled={isSubmitting}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #d4af37, #e6b800)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#1a1a2e',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                Get Quote & Book
              </button>
            )}
          </div>
        </form>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '450px',
              width: '90%'
            }}>
              <h3 style={{ color: '#d4af37', fontSize: '1.4rem', marginBottom: '20px', textAlign: 'center' }}>
                Confirm Your Booking
              </h3>
              
              <div style={{ marginBottom: '20px', fontSize: '0.95rem', color: '#e2e8f0' }}>
                <p style={{ marginBottom: '12px' }}><strong>Customer:</strong> {formData.customerName}</p>
                <p style={{ marginBottom: '12px' }}><strong>Email:</strong> {formData.customerEmail}</p>
                <p style={{ marginBottom: '12px' }}><strong>Phone:</strong> {formData.customerPhone}</p>
                <p style={{ marginBottom: '12px' }}><strong>Service:</strong> {formData.moveType}</p>
                <p style={{ marginBottom: '12px' }}><strong>Date:</strong> {formData.moveDate} at {formData.moveTime}</p>
                <p style={{ marginBottom: '20px' }}><strong>Estimated Price:</strong> <span style={{ color: '#d4af37', fontWeight: 'bold' }}>KES {estimatedPrice.toLocaleString()}</span></p>
              </div>
              
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
                Are you sure you want to submit this booking? Our team will contact you to confirm the details.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '2px solid rgba(212, 175, 55, 0.2)',
  borderRadius: '12px',
  color: '#e2e8f0',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
};

const errorStyle = {
  color: '#ef4444',
  fontSize: '0.8rem',
  marginTop: '4px',
  display: 'block'
};

