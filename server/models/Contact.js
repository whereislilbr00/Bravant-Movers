const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  // Customer Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Service Interest
  service: {
    type: String,
    enum: ['moving', 'cleaning', 'packing', 'storage', 'general', 'quote', 'other'],
    default: 'general'
  },
  
  // Message
  message: {
    type: String,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  
  // Admin Notes
  adminNotes: {
    type: String,
    default: ''
  },
  
  // Source
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'referral', 'social'],
    default: 'website'
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
  repliedAt: {
    type: Date
  }
});

// Update timestamp on save
contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', contactSchema);
