'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, DollarSign, Clock, CheckCircle, Truck, Mail, LogOut, Activity, ChevronRight, AlertCircle, Plus, X } from 'lucide-react';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewBooking, setShowNewBooking] = useState(false);
  
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [contacts, setContacts] = useState([]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    moveType: 'local',
    moveDate: '',
    moveTime: '',
    pickupAddress: { street: '', city: '', state: '', zipCode: '' },
    deliveryAddress: { street: '', city: '', state: '', zipCode: '' },
    propertyType: 'house',
    bedrooms: 1,
    floors: 1,
    packingService: false,
    cleaningService: false,
    insuranceLevel: 'basic',
    totalPrice: 0,
    status: 'pending',
    paymentStatus: 'unpaid'
  });
  const [savingBooking, setSavingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const statusColors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    'in-progress': '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444'
  };

  const paymentStatusColors = {
    pending: '#f59e0b',
    processing: '#8b5cf6',
    completed: '#10b981',
    failed: '#ef4444',
    refunded: '#6b7280'
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/api/bookings/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setIsLoggedIn(true);
          fetchData();
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      }
    }
    setLoading(false);
  };

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
        const bookingStatsRes = await fetch(`${API_URL}/api/bookings/stats`, { headers });
        const bookingStatsData = await bookingStatsRes.json();
        const paymentStatsRes = await fetch(`${API_URL}/api/payments/stats`, { headers });
        const paymentStatsData = await paymentStatsRes.json();
        const combinedStats = {
          ...(bookingStatsData?.success ? bookingStatsData.stats : {}),
          paymentStats: paymentStatsData?.success ? paymentStatsData.stats : null
        };
        setStats(combinedStats);


      const bookingsRes = await fetch(`${API_URL}/api/bookings`, { headers });
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) setBookings(bookingsData.bookings || []);

      const paymentsRes = await fetch(`${API_URL}/api/payments`, { headers });
      const paymentsData = await paymentsRes.json();
      if (paymentsData.success) setPayments(paymentsData.payments || []);

      const contactsRes = await fetch(`${API_URL}/api/contact`, { headers });
      const contactsData = await contactsRes.json();
      if (contactsData.success) setContacts(contactsData.contacts || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success && data.user.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        fetchData();
      } else {
        setAuthError('Access denied. Admin credentials required.');
      }
    } catch (err) {
      setAuthError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setStats(null);
    setBookings([]);
    setPayments([]);
    setContacts([]);
  };

  const updateBookingStatus = async (bookingId, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        alert('Booking status updated!');
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const updatePaymentStatus = async (paymentId, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_URL}/api/payments/${paymentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        alert(`Payment status updated to ${status}!`);
      } else {
        alert('Failed to update payment status: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to update payment status');
    }
  };

  const handleBookingFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('pickupAddress.')) {
      const field = name.split('.')[1];
      setBookingForm(prev => ({
        ...prev,
        pickupAddress: { ...prev.pickupAddress, [field]: value }
      }));
    } else if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1];
      setBookingForm(prev => ({
        ...prev,
        deliveryAddress: { ...prev.deliveryAddress, [field]: value }
      }));
    } else if (type === 'checkbox') {
      setBookingForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setBookingForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculatePrice = () => {
    let price = 99;
    if (bookingForm.moveType === 'local') price += 99;
    else if (bookingForm.moveType === 'long-distance') price += 299;
    else if (bookingForm.moveType === 'packing-only') price += 99;
    else if (bookingForm.moveType === 'cleaning-service') price += 149;
    
    price += (bookingForm.bedrooms || 1) * 50;
    if (bookingForm.packingService) price += 150;
    if (bookingForm.cleaningService) price += 120;
    if (bookingForm.insuranceLevel === 'standard') price += 50;
    if (bookingForm.insuranceLevel === 'premium') price += 100;
    
    return price;
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setSavingBooking(true);
    
    const token = localStorage.getItem('adminToken');
    const price = calculatePrice();
    
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...bookingForm,
          totalPrice: price
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setShowNewBooking(false);
          setBookingSuccess(false);
          setBookingForm({
            customerName: '',
            customerEmail: '',
            customerPhone: '',
            moveType: 'local',
            moveDate: '',
            moveTime: '',
            pickupAddress: { street: '', city: '', state: '', zipCode: '' },
            deliveryAddress: { street: '', city: '', state: '', zipCode: '' },
            propertyType: 'house',
            bedrooms: 1,
            floors: 1,
            packingService: false,
            cleaningService: false,
            insuranceLevel: 'basic',
            totalPrice: 0,
            status: 'pending',
            paymentStatus: 'unpaid'
          });
          fetchData();
        }, 2000);
      } else {
        alert('Failed to create booking: ' + data.error);
      }
    } catch (err) {
      alert('Error creating booking');
    }
    setSavingBooking(false);
  };

  if (loading) {
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

  if (!isLoggedIn) {
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
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          borderRadius: '24px',
          padding: '50px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #d4af37, #e6b800)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)'
            }}>
              <Truck size={40} color="#1a1a2e" />
            </div>
            <h1 style={{ color: '#d4af37', fontSize: '1.8rem', marginBottom: '8px', fontWeight: '700' }}>
              Bravant Movers
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Admin Portal
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '10px', fontWeight: '500' }}>
                <Mail size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@bravantmovers.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '10px', fontWeight: '500' }}>
                <LogOut size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '1rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {authError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '24px',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <AlertCircle size={20} />
                {authError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #d4af37, #e6b800)',
                color: '#1a1a2e',
                border: 'none',
                borderRadius: '14px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)'
              }}
            >
              Sign In
            </button>
          </form>

          <Link href="/">
            <p style={{ textAlign: 'center', marginTop: '24px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}>
              ← Back to Website
            </p>
          </Link>
        </div>
      </div>
    );
  }

  if (showNewBooking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '20px',
          padding: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#d4af37', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={24} />
              New Booking - Quick Entry
            </h2>
            <button
              onClick={() => setShowNewBooking(false)}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                color: '#fca5a5'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {bookingSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <CheckCircle size={60} color="#10b981" style={{ marginBottom: '20px' }} />
              <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '10px' }}>Booking Created Successfully!</h3>
              <p style={{ color: '#94a3b8' }}>Redirecting to bookings...</p>
            </div>
          ) : (
            <form onSubmit={submitBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <h4 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>Customer Details</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <input type="text" name="customerName" value={bookingForm.customerName} onChange={handleBookingFormChange} placeholder="Full Name *" required style={inputStyle} />
                    <input type="email" name="customerEmail" value={bookingForm.customerEmail} onChange={handleBookingFormChange} placeholder="Email Address *" required style={inputStyle} />
                    <input type="tel" name="customerPhone" value={bookingForm.customerPhone} onChange={handleBookingFormChange} placeholder="Phone Number *" required style={inputStyle} />
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>Service Details</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <select name="moveType" value={bookingForm.moveType} onChange={handleBookingFormChange} style={inputStyle}>
                      <option value="local">Local Move</option>
                      <option value="long-distance">Long Distance</option>
                      <option value="packing-only">Packing Only</option>
                      <option value="cleaning-service">Cleaning Service</option>
                      <option value="storage">Storage</option>
                    </select>
                    <input type="date" name="moveDate" value={bookingForm.moveDate} onChange={handleBookingFormChange} required style={inputStyle} />
                    <input type="time" name="moveTime" value={bookingForm.moveTime} onChange={handleBookingFormChange} required style={inputStyle} />
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>Pickup Address</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <input type="text" name="pickupAddress.street" value={bookingForm.pickupAddress.street} onChange={handleBookingFormChange} placeholder="Street Address *" required style={inputStyle} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="text" name="pickupAddress.city" value={bookingForm.pickupAddress.city} onChange={handleBookingFormChange} placeholder="City *" required style={inputStyle} />
                      <input type="text" name="pickupAddress.state" value={bookingForm.pickupAddress.state} onChange={handleBookingFormChange} placeholder="State *" required style={inputStyle} />
                    </div>
                    <input type="text" name="pickupAddress.zipCode" value={bookingForm.pickupAddress.zipCode} onChange={handleBookingFormChange} placeholder="Zip Code *" required style={inputStyle} />
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>Delivery Address</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <input type="text" name="deliveryAddress.street" value={bookingForm.deliveryAddress.street} onChange={handleBookingFormChange} placeholder="Street Address *" required style={inputStyle} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="text" name="deliveryAddress.city" value={bookingForm.deliveryAddress.city} onChange={handleBookingFormChange} placeholder="City *" required style={inputStyle} />
                      <input type="text" name="deliveryAddress.state" value={bookingForm.deliveryAddress.state} onChange={handleBookingFormChange} placeholder="State *" required style={inputStyle} />
                    </div>
                    <input type="text" name="deliveryAddress.zipCode" value={bookingForm.deliveryAddress.zipCode} onChange={handleBookingFormChange} placeholder="Zip Code *" required style={inputStyle} />
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>Property Details</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <select name="propertyType" value={bookingForm.propertyType} onChange={handleBookingFormChange} style={inputStyle}>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="office">Office</option>
                    </select>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="number" name="bedrooms" value={bookingForm.bedrooms} onChange={handleBookingFormChange} min="0" placeholder="Bedrooms" style={inputStyle} />
                      <input type="number" name="floors" value={bookingForm.floors} onChange={handleBookingFormChange} min="1" placeholder="Floors" style={inputStyle} />
                    </div>
                    <select name="insuranceLevel" value={bookingForm.insuranceLevel} onChange={handleBookingFormChange} style={inputStyle}>
                      <option value="basic">Basic Insurance</option>
                      <option value="standard">Standard Insurance</option>
                      <option value="premium">Premium Insurance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#d4af37', marginBottom: '15px', fontSize: '1rem' }}>Additional Services</h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', cursor: 'pointer' }}>
                      <input type="checkbox" name="packingService" checked={bookingForm.packingService} onChange={handleBookingFormChange} style={{ width: '18px', height: '18px' }} />
                      Packing Service (KES 150)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', cursor: 'pointer' }}>
                      <input type="checkbox" name="cleaningService" checked={bookingForm.cleaningService} onChange={handleBookingFormChange} style={{ width: '18px', height: '18px' }} />
                      Cleaning Service (KES 120)
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Estimated Price:</p>
                  <p style={{ color: '#d4af37', fontSize: '2rem', fontWeight: '700' }}>KES {calculatePrice().toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowNewBooking(false)} style={{ padding: '14px 28px', background: 'transparent', border: '2px solid rgba(212, 175, 55, 0.3)', borderRadius: '12px', color: '#e2e8f0', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={savingBooking} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #d4af37, #e6b800)', border: 'none', borderRadius: '12px', color: '#1a1a2e', fontSize: '1rem', fontWeight: '700', cursor: savingBooking ? 'not-allowed' : 'pointer', opacity: savingBooking ? 0.7 : 1 }}>
                    {savingBooking ? 'Creating...' : 'Create Booking'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', padding: '0' }}>
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', padding: '16px 30px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #d4af37, #e6b800)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)' }}>
              <Truck size={26} color="#1a1a2e" />
            </div>
            <div>
              <h1 style={{ color: '#d4af37', fontSize: '1.4rem', marginBottom: '2px', fontWeight: '700' }}>Bravant Movers</h1>
              <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Admin Dashboard</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button onClick={() => setShowNewBooking(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #d4af37, #e6b800)', border: 'none', borderRadius: '10px', color: '#1a1a2e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)' }}>
              <Plus size={18} /> New Booking
            </button>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Revenue</p>
              <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: '700' }}>KES {(stats?.paymentStats?.totalRevenue || 0).toLocaleString()}</p>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(212, 175, 55, 0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</p>
              <p style={{ color: '#f59e0b', fontSize: '1.2rem', fontWeight: '700' }}>{stats?.paymentStats?.byStatus?.find(s => s._id === 'pending')?.count || 0}</p>
            </div>
            <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#fca5a5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', marginLeft: '10px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', background: 'rgba(15, 23, 42, 0.5)', padding: '8px', borderRadius: '16px', width: 'fit-content' }}>
          {[
            { id: 'dashboard', icon: Activity, label: 'Dashboard' },
            { id: 'bookings', icon: Calendar, label: 'Bookings' },
            { id: 'payments', icon: DollarSign, label: 'Payments' },
            { id: 'contacts', icon: Mail, label: 'Contacts' }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #d4af37, #e6b800)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  color: activeTab === tab.id ? '#1a1a2e' : '#94a3b8',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === tab.id ? '0 8px 20px rgba(212, 175, 55, 0.3)' : 'none'
                }}
              >
                <Icon size={18} />
                {tab.label}
                {tab.id === 'contacts' && contacts.filter(c => !c.isRead).length > 0 && (
                  <span style={{ background: '#ef4444', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '0.75rem' }}>
                    {contacts.filter(c => !c.isRead).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'dashboard' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #d4af37, #e6b800)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)' }}>
                    <Calendar size={26} color="#1a1a2e" />
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>Total Bookings</p>
                <p style={{ color: '#d4af37', fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{stats.totalBookings || 0}</p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)' }}>
                    <DollarSign size={26} color="#1a1a2e" />
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>Total Revenue</p>
                <p style={{ color: '#10b981', fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>KES {(stats.totalRevenue || 0).toLocaleString()}</p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)' }}>
                    <Clock size={26} color="#1a1a2e" />
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>Pending Jobs</p>
                <p style={{ color: '#f59e0b', fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{stats.byStatus?.find(s => s._id === 'pending')?.count || 0}</p>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)' }}>
                    <CheckCircle size={26} color="#1a1a2e" />
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px' }}>Completed</p>
                <p style={{ color: '#3b82f6', fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 }}>{stats.byStatus?.find(s => s._id === 'completed')?.count || 0}</p>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '20px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#e2e8f0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={20} color="#d4af37" />
                  Recent Bookings
                </h3>
                <button onClick={() => setActiveTab('bookings')} style={{ padding: '8px 16px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', color: '#d4af37', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '500' }}>
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(212, 175, 55, 0.1)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Truck size={20} color="#d4af37" />
                      </div>
                      <div>
                        <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.95rem' }}>{booking.customerName}</p>
                        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{booking.moveType} • {booking.pickupAddress?.city} → {booking.deliveryAddress?.city}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#d4af37', fontWeight: '700', fontSize: '1rem' }}>KES {(booking.totalPrice || 0).toLocaleString()}</p>
                        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{new Date(booking.moveDate).toLocaleDateString()}</p>
                      </div>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600', background: `${statusColors[booking.status]}20`, color: statusColors[booking.status] }}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ color: '#e2e8f0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={22} color="#d4af37" />
                  All Bookings ({bookings.length})
                </h2>
                <button onClick={() => setShowNewBooking(true)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #d4af37, #e6b800)', border: 'none', borderRadius: '10px', color: '#1a1a2e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Plus size={18} /> New Booking
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Customer</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Service</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Route</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Date</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Amount</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Status</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <td style={{ padding: '14px', color: '#e2e8f0' }}><div><p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{booking.customerName}</p><p style={{ color: '#64748b', fontSize: '0.8rem' }}>{booking.customerPhone}</p></div></td>
                        <td style={{ padding: '14px', color: '#e2e8f0', textTransform: 'capitalize', fontSize: '0.9rem' }}>{booking.moveType}</td>
                        <td style={{ padding: '14px', color: '#e2e8f0', fontSize: '0.9rem' }}>{booking.pickupAddress?.city} → {booking.deliveryAddress?.city}</td>
                        <td style={{ padding: '14px', color: '#e2e8f0', fontSize: '0.9rem' }}>{new Date(booking.moveDate).toLocaleDateString()}</td>
                        <td style={{ padding: '14px', color: '#d4af37', fontWeight: '700', fontSize: '0.95rem' }}>KES {(booking.totalPrice || 0).toLocaleString()}</td>
                        <td style={{ padding: '14px' }}>
                          <select value={booking.status} onChange={(e) => updateBookingStatus(booking._id, e.target.value)} style={{ padding: '6px 10px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '6px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem' }}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', background: booking.paymentStatus === 'paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' }}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                <h2 style={{ color: '#e2e8f0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DollarSign size={22} color="#d4af37" />
                  Payment History ({payments.length})
                </h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Customer</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Amount</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Method</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Status</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Date</th>
                      <th style={{ padding: '14px', textAlign: 'left', color: '#d4af37', fontWeight: '600', fontSize: '0.85rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment._id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <td style={{ padding: '14px', color: '#e2e8f0' }}><div><p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{payment.customerName}</p><p style={{ color: '#64748b', fontSize: '0.8rem' }}>{payment.customerEmail}</p></div></td>
                        <td style={{ padding: '14px', color: '#10b981', fontWeight: '700', fontSize: '1rem' }}>KES {(payment.amount || 0).toLocaleString()}</td>
                        <td style={{ padding: '14px', color: '#e2e8f0', textTransform: 'capitalize', fontSize: '0.9rem' }}>{payment.paymentMethod}</td>
                        <td style={{ padding: '14px' }}>
                          <select 
                            value={payment.status} 
                            onChange={(e) => updatePaymentStatus(payment._id, e.target.value)} 
                            style={{ 
                              padding: '6px 10px', 
                              background: `${paymentStatusColors[payment.status]}20`, 
                              border: `1px solid ${paymentStatusColors[payment.status]}50`, 
                              borderRadius: '6px', 
                              color: paymentStatusColors[payment.status], 
                              cursor: 'pointer', 
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px', color: '#e2e8f0', fontSize: '0.9rem' }}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '14px' }}>
                          {payment.status === 'pending' && (
                            <button 
                              onClick={() => updatePaymentStatus(payment._id, 'completed')}
                              style={{ 
                                padding: '6px 12px', 
                                background: 'rgba(16, 185, 129, 0.2)', 
                                border: '1px solid rgba(16, 185, 129, 0.3)', 
                                borderRadius: '6px', 
                                color: '#10b981', 
                                cursor: 'pointer', 
                                fontSize: '0.8rem',
                                fontWeight: '600'
                              }}
                            >
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No payments yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {contacts.map((contact) => (
                <div key={contact._id} style={{ background: 'rgba(15, 23, 42, 0.6)', border: `1px solid ${contact.isRead ? 'rgba(212, 175, 55, 0.1)' : 'rgba(212, 175, 55, 0.3)'}`, borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.1))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mail size={22} color="#d4af37" />
                      </div>
                      <div>
                        <h3 style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>{contact.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{contact.email} • {contact.phone}</p>
                      </div>
                    </div>
                    <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', background: contact.isRead ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: contact.isRead ? '#10b981' : '#f59e0b' }}>
                      {contact.isRead ? 'Read' : 'New'}
                    </span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '6px', color: '#d4af37', fontSize: '0.8rem', fontWeight: '500', marginBottom: '10px' }}>
                      {contact.service || 'General Inquiry'}
                    </span>
                    <p style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>{contact.message}</p>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.8rem' }}>{new Date(contact.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {contacts.length === 0 && (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '20px', padding: '60px', textAlign: 'center' }}>
                  <Mail size={44} color="#64748b" style={{ marginBottom: '14px' }} />
                  <p style={{ color: '#64748b', fontSize: '1rem' }}>No contact submissions yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '2px solid rgba(212, 175, 55, 0.2)',
  borderRadius: '10px',
  color: '#e2e8f0',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box'
};

