const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Related Booking
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  
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
    trim: true
  },
  
  // Payment Amount
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['stripe-card', 'stripe-paypal', 'pesapal', 'cash', 'check', 'bank-transfer'],
    required: true
  },
  
  // Payment Gateway Details
  stripePaymentIntentId: {
    type: String
  },
  stripeCustomerId: {
    type: String
  },
  pesapalOrderId: {
    type: String
  },
  pesapalTransactionId: {
    type: String
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Description
  description: {
    type: String,
    default: 'Bravant Movers Service Payment'
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Error Details (if failed)
  errorMessage: {
    type: String
  },
  errorCode: {
    type: String
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
  completedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  }
});

// Update timestamp on save
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
paymentSchema.index({ status: 1 });
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ pesapalOrderId: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
