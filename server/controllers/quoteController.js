const Quote = require('../models/Quote');
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

// Email transporter configuration using SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Price calculation constants (same as booking controller)
const PRICING = {
  baseRate: 99,
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
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: moveType and propertyType' 
      });
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
        moveType,
        propertyType,
        bedrooms: bedrooms || 1,
        floors: floors || 1,
        basePrice: moveTypePrice.base,
        bedroomCost: (bedrooms || 1) * PRICING.perBedroom,
        floorCost: (!hasElevator && floors > 1) ? (floors - 1) * PRICING.perFloor : 0,
        additionalServicesPrice,
        insurancePrice,
        totalPrice,
        validFor: '30 days'
      }
    });
  } catch (error) {
    console.error('Quote calculation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to calculate quote' 
    });
  }
};

// Submit quote request
exports.submitQuote = async (req, res) => {
  try {
    const quoteData = req.body;

    // Calculate quote if not provided
    let totalPrice = quoteData.totalPrice;
    if (!totalPrice) {
      const { 
        moveType, propertyType, bedrooms, floors, hasElevator,
        packingService, cleaningService, deepCleaning,
        furnitureDisassembly, fragileItemsHandling, insuranceLevel
      } = quoteData;

      const moveTypePrice = PRICING.moveTypes[moveType] || PRICING.moveTypes.local;
      let calculatedPrice = PRICING.baseRate + moveTypePrice.base;
      calculatedPrice += (bedrooms || 1) * PRICING.perBedroom;
      if (!hasElevator && floors > 1) calculatedPrice += (floors - 1) * PRICING.perFloor;
      
      let additionalServicesPrice = 0;
      if (packingService) additionalServicesPrice += PRICING.packingService;
      if (cleaningService) additionalServicesPrice += PRICING.cleaningService;
      if (deepCleaning) additionalServicesPrice += PRICING.deepCleaning;
      if (furnitureDisassembly) additionalServicesPrice += PRICING.furnitureDisassembly;
      if (fragileItemsHandling) additionalServicesPrice += PRICING.fragileItemsHandling;
      
      const insurancePrice = PRICING.insurance[insuranceLevel] || 0;
      totalPrice = calculatedPrice + additionalServicesPrice + insurancePrice;
    }

    // Create quote
    const quote = new Quote({
      ...quoteData,
      totalPrice: totalPrice || PRICING.baseRate,
      additionalServicesPrice: quoteData.additionalServicesPrice || 0,
      insurancePrice: quoteData.insurancePrice || 0,
      basePrice: quoteData.basePrice || PRICING.baseRate,
      status: 'pending'
    });

    await quote.save();

    // Send confirmation email to customer
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'Bravant Movers <noreply@bravantmovers.com>',
        to: quote.customerEmail,
        subject: 'Quote Request Received - Bravant Movers & Cleaners',
        html: `
          <h1>Quote Request Received!</h1>
          <p>Dear ${quote.customerName},</p>
          <p>Thank you for requesting a quote from Bravant Movers & Cleaners.</p>
          <h2>Your Quote Summary:</h2>
          <ul>
            <li>Move Type: ${quote.moveType}</li>
            <li>Property Type: ${quote.propertyType}</li>
            <li>Bedrooms: ${quote.bedrooms}</li>
            <li>Estimated Price: $${quote.totalPrice}</li>
          </ul>
          <p>We will send you a detailed quote within 24-48 hours.</p>
          <p>If you have any questions, please call us at (555) 123-4567</p>
        `
      });
    } catch (emailError) {
      console.error('Quote confirmation email error:', emailError);
    }

    // Send notification to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'Bravant Movers <noreply@bravantmovers.com>',
        to: process.env.ADMIN_EMAIL || 'admin@bravantmovers.com',
        subject: 'New Quote Request - Bravant Movers',
        html: `
          <h1>New Quote Request!</h1>
          <p><strong>Customer:</strong> ${quote.customerName}</p>
          <p><strong>Email:</strong> ${quote.customerEmail}</p>
          <p><strong>Phone:</strong> ${quote.customerPhone}</p>
          <p><strong>Move Type:</strong> ${quote.moveType}</p>
          <p><strong>Property Type:</strong> ${quote.propertyType}</p>
          <p><strong>Estimated Price:</strong> $${quote.totalPrice}</p>
        `
      });
    } catch (emailError) {
      console.error('Admin quote email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully. We will contact you soon!',
      quoteId: quote._id
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit quote request' 
    });
  }
};

// Get all quotes (admin)
exports.getAllQuotes = async (req, res) => {
  try {
    const { status, moveType, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (moveType) {
      query.moveType = moveType;
    }

    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Quote.countDocuments(query);

    res.json({
      success: true,
      quotes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get quotes' 
    });
  }
};

// Get quote by ID
exports.getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ 
        success: false,
        error: 'Quote not found' 
      });
    }

    res.json({
      success: true,
      quote
    });
  } catch (error) {
    console.error('Get quote error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get quote' 
    });
  }
};

// Update quote (admin)
exports.updateQuote = async (req, res) => {
  try {
    const { totalPrice, basePrice, additionalServicesPrice, insurancePrice, adminNotes } = req.body;
    
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { 
        totalPrice,
        basePrice,
        additionalServicesPrice,
        insurancePrice,
        adminNotes,
        updatedAt: Date.now() 
      },
      { new: true, runValidators: true }
    );

    if (!quote) {
      return res.status(404).json({ 
        success: false,
        error: 'Quote not found' 
      });
    }

    res.json({
      success: true,
      quote
    });
  } catch (error) {
    console.error('Update quote error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update quote' 
    });
  }
};

// Send quote to customer (admin)
exports.sendQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ 
        success: false,
        error: 'Quote not found' 
      });
    }

    // Update quote status
    quote.status = 'sent';
    quote.sentAt = Date.now();
    await quote.save();

    // Send quote email to customer
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'Bravant Movers <noreply@bravantmovers.com>',
        to: quote.customerEmail,
        subject: 'Your Moving Quote - Bravant Movers & Cleaners',
        html: `
          <h1>Your Moving Quote</h1>
          <p>Dear ${quote.customerName},</p>
          <p>Thank you for choosing Bravant Movers & Cleaners. Please find your quote below:</p>
          
          <h2>Quote Details:</h2>
          <ul>
            <li><strong>Move Type:</strong> ${quote.moveType}</li>
            <li><strong>Property Type:</strong> ${quote.propertyType}</li>
            <li><strong>Bedrooms:</strong> ${quote.bedrooms}</li>
            <li><strong>Floors:</strong> ${quote.floors}</li>
          </ul>
          
          <h2>Pricing:</h2>
          <ul>
            <li>Base Price: $${quote.basePrice}</li>
            <li>Additional Services: $${quote.additionalServicesPrice}</li>
            <li>Insurance: $${quote.insurancePrice}</li>
            <li><strong>Total: $${quote.totalPrice}</strong></li>
          </ul>
          
          <p><strong>Quote Valid Until:</strong> ${new Date(quote.validUntil).toLocaleDateString()}</p>
          
          <p>To proceed with this quote, please click the link below or call us at (555) 123-4567</p>
          
          <p>Best regards,<br>The Bravant Movers Team</p>
        `
      });
    } catch (emailError) {
      console.error('Send quote email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Quote sent to customer'
    });
  } catch (error) {
    console.error('Send quote error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send quote' 
    });
  }
};

// Convert quote to booking
exports.convertToBooking = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ 
        success: false,
        error: 'Quote not found' 
      });
    }

    // Create booking from quote
    const booking = new Booking({
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      moveType: quote.moveType,
      moveDate: quote.moveDate,
      moveTime: '10:00 AM', // Default time
      pickupAddress: quote.pickupAddress,
      deliveryAddress: quote.deliveryAddress,
      propertyType: quote.propertyType,
      bedrooms: quote.bedrooms,
      floors: quote.floors,
      hasElevator: quote.hasElevator,
      hasStairs: quote.hasStairs,
      packingService: quote.packingService,
      cleaningService: quote.cleaningService,
      deepCleaning: quote.deepCleaning,
      furnitureDisassembly: quote.furnitureDisassembly,
      fragileItemsHandling: quote.fragileItemsHandling,
      insuranceLevel: quote.insuranceLevel,
      basePrice: quote.basePrice,
      additionalServicesPrice: quote.additionalServicesPrice,
      insurancePrice: quote.insurancePrice,
      totalPrice: quote.totalPrice,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    await booking.save();

    // Update quote status
    quote.status = 'converted';
    quote.convertedToBooking = booking._id;
    await quote.save();

    res.status(201).json({
      success: true,
      message: 'Quote converted to booking successfully',
      booking
    });
  } catch (error) {
    console.error('Convert to booking error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to convert quote to booking' 
    });
  }
};

// Delete quote (admin)
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ 
        success: false,
        error: 'Quote not found' 
      });
    }

    res.json({
      success: true,
      message: 'Quote deleted successfully'
    });
  } catch (error) {
    console.error('Delete quote error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete quote' 
    });
  }
};
