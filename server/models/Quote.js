const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
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
    enum: ['local', 'long-distance', 'packing-only', 'unpacking-only', 'storage'],
    required: true
  },
  moveDate: {
    type: Date
  },
  
  // Address Information
  pickupAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  deliveryAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  
  // Property Details
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'townhouse', 'office', 'storage']
  },
  bedrooms: {
    type: Number,
    default: 1,
    min: 0
  },
  floors: {
    type: Number,
    default: 1
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
  
  // Insurance
  insuranceLevel: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'none'],
    default: 'basic'
  },
  
  // Quote Details
  estimatedWeight: {
    type: Number,
    default: 0
  },
  estimatedDistance: {
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
  
  // Quote Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'accepted', 'expired', 'converted'],
    default: 'pending'
  },
  
  // Validity
  validUntil: {
    type: Date
  },
  
  // Notes
  adminNotes: {
    type: String,
    default: ''
  },
  
  // Conversion (linked booking)
  convertedToBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date
  }
});

// Update timestamp on save
quoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Set validUntil to 30 days from creation
quoteSchema.pre('save', function(next) {
  if (!this.validUntil) {
    this.validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Index for faster queries
quoteSchema.index({ status: 1 });
quoteSchema.index({ customerEmail: 1 });
quoteSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Quote', quoteSchema);
