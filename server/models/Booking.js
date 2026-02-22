const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Customer Information
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  },
  
  // Move Details
  moveType: {
    type: String,
    required: true,
    enum: ['local', 'long-distance', 'packing-only', 'unpacking-only', 'storage']
  },
  moveDate: {
    type: Date,
    required: true
  },
  moveTime: {
    type: String,
    required: true
  },
  
  // Address Information
  pickupAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    apartment: { type: String, default: '' }
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    apartment: { type: String, default: '' }
  },
  
  // Property Details
  propertyType: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'condo', 'townhouse', 'office', 'storage']
  },
  bedrooms: {
    type: Number,
    default: 1,
    min: 0,
    max: 10
  },
  floors: {
    type: Number,
    default: 1,
    min: 1
  },
  hasElevator: {
    type: Boolean,
    default: false
  },
  hasStairs: {
    type: Boolean,
    default: false
  },
  
  // Additional Services
  packingService: {
    type: Boolean,
    default: false
  },
  cleaningService: {
    type: Boolean,
    default: false
  },
  deepCleaning: {
    type: Boolean,
    default: false
  },
  furnitureDisassembly: {
    type: Boolean,
    default: false
  },
  fragileItemsHandling: {
    type: Boolean,
    default: false
  },
  
  // Insurance & Special Requirements
  insuranceLevel: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'none'],
    default: 'basic'
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  
  // Quote & Pricing
  estimatedWeight: {
    type: Number,
    default: 0
  },
  estimatedHours: {
    type: Number,
    default: 0
  },
  basePrice: {
    type: Number,
    default: 0
  },
  additionalServicesPrice: {
    type: Number,
    default: 0
  },
  insurancePrice: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  
  // Booking Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'debit-card', 'cash', 'check', 'none'],
    default: 'none'
  },
  
  // Admin Notes
  adminNotes: {
    type: String,
    default: ''
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
bookingSchema.index({ moveDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ customerEmail: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
