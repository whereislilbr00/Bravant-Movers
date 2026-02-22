const Booking = require('../models/Booking');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'bravantmovers@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-email-password'
  }
});

// Price calculation constants
const PRICING = {
  baseRate: 99, // Base service fee
  perBedroom: 50,
  perFloor: 25,
  packingService: 150,
  cleaningService: 120,
  deepCleaning: 250,
  furnitureDisassembly: 75,
  fragileItemsHandling: 50,
  insurance: {
    basic: 0,
    standard: 50,
    premium: 100
  },
  moveTypes: {
    local: { base: 99, perHour: 75 },
    'long-distance': { base: 299, perMile: 1.5 },
    'packing-only': { base: 99, perHour: 60 },
    'unpacking-only': { base: 99, perHour: 60 },
    storage: { base: 149, perDay: 25 }
  }
};

// Calculate quote (public endpoint)
exports.calculateQuote = async (req, res) => {
  try {
    const { 
      moveType, 
      propertyType, 
      bedrooms, 
      floors, 
      hasElevator, 
      hasStairs,
      packingService,
      cleaningService,
      deepCleaning,
      furnitureDisassembly,
      fragileItemsHandling,
      insuranceLevel,
      estimatedDistance
    } = req.body;

    // Validate required fields
    if (!moveType || !propertyType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let totalPrice = PRICING.baseRate;
    let additionalServicesPrice = 0;

    // Calculate base price based on move type
    const moveTypePrice = PRICING.moveTypes[moveType] || PRICING.moveTypes.local;
    totalPrice += moveTypePrice.base;

    // Add bedroom cost
    totalPrice += (bedrooms || 1) * PRICING.perBedroom;

    // Add floor cost (if no elevator)
    if (!hasElevator && floors > 1) {
      totalPrice += (floors - 1) * PRICING.perFloor;
    }

    // Add additional services
    if (packingService) additionalServicesPrice += PRICING.packingService;
    if (cleaningService) additionalServicesPrice += PRICING.cleaningService;
    if (deepCleaning) additionalServicesPrice += PRICING.deepCleaning;
    if (furnitureDisassembly) additionalServicesPrice += PRICING.furnitureDisassembly;
    if (fragileItemsHandling) additionalServicesPrice += PRICING.fragileItemsHandling;

    // Add insurance cost
    const insurancePrice = PRICING.insurance[insuranceLevel] || 0;

    totalPrice += additionalServicesPrice + insurancePrice;

    res.json({
      success: true,
      quote: {
        basePrice: moveTypePrice.base,
        bedroomCost: (bedrooms || 1) * PRICING.perBedroom,
        floorCost: (!hasElevator && floors > 1) ? (floors - 1) * PRICING.perFloor : 0,
        additionalServicesPrice,
        insurancePrice,
        totalPrice
      }
    });
  } catch (error) {
    console.error('Quote calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate quote' });
  }
};

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Calculate quote if not provided
    let totalPrice = bookingData.totalPrice;
    if (!totalPrice) {
      const quoteResult = await this.calculateQuote(req, res);
      if (!bookingData.totalPrice) {
        totalPrice = quoteResult.quote.totalPrice;
      }
    }

    // Create booking
    const booking = new Booking({
      ...bookingData,
      totalPrice: totalPrice || PRICING.baseRate,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    await booking.save();

    // Send confirmation email to customer
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'bravantmovers@gmail.com',
        to: booking.customerEmail,
        subject: 'Booking Confirmation - Bravant Movers & Cleaners',
        html: `
          <h1>Booking Confirmed!</h1>
          <p>Dear ${booking.customerName},</p>
          <p>Your move has been scheduled successfully.</p>
          <h2>Booking Details:</h2>
          <ul>
            <li>Move Date: ${new Date(booking.moveDate).toLocaleDateString()}</li>
            <li>Move Time: ${booking.moveTime}</li>
            <li>Move Type: ${booking.moveType}</li>
            <li>Total Price: $${booking.totalPrice}</li>
          </ul>
          <p>We will contact you shortly to confirm the details.</p>
          <p>Thank you for choosing Bravant Movers & Cleaners!</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    // Send notification to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'bravantmovers@gmail.com',
        to: process.env.ADMIN_EMAIL || 'admin@bravantmovers.com',
        subject: 'New Booking Received - Bravant Movers',
        html: `
          <h1>New Booking!</h1>
          <p>A new booking has been submitted:</p>
          <ul>
            <li>Customer: ${booking.customerName}</li>
            <li>Email: ${booking.customerEmail}</li>
            <li>Phone: ${booking.customerPhone}</li>
            <li>Move Date: ${new Date(booking.moveDate).toLocaleDateString()}</li>
            <li>Total Price: $${booking.totalPrice}</li>
          </ul>
        `
      });
    } catch (emailError) {
      console.error('Admin email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.moveDate = {};
      if (startDate) query.moveDate.$gte = new Date(startDate);
      if (endDate) query.moveDate.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .sort({ moveDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerEmail: req.user.email })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && booking.customerEmail !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check ownership (unless admin)
    if (req.user.role !== 'admin' && booking.customerEmail !== req.user.email) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

// Update booking status (admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

// Update payment status (admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, paymentMethod, updatedAt: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      message: 'Payment status updated',
      booking
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

// Get booking statistics (admin)
exports.getBookingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const stats = await Booking.aggregate([
      {
        $match: Object.keys(dateFilter).length > 0 ? { moveDate: dateFilter } : {}
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments(
      Object.keys(dateFilter).length > 0 ? { moveDate: dateFilter } : {}
    );

    const totalRevenue = await Booking.aggregate([
      {
        $match: { 
          ...Object.keys(dateFilter).length > 0 ? { moveDate: dateFilter } : {},
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        totalBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};
