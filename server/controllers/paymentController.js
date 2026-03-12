const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Stripe = require('stripe');
const axios = require('axios');
const nodemailer = require('nodemailer');

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Email transporter configuration using SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Create Stripe Payment Intent
exports.createStripePayment = async (req, res) => {
  try {
    const { amount, currency = 'kes', bookingId, customerEmail, customerName, customerPhone } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    // Create payment record - store in KES without cents conversion
    const payment = new Payment({
      booking: bookingId,
      customerName,
      customerEmail,
      customerPhone,
      amount: amount, // Keep in KES (no cents conversion for KES)
      currency: currency.toUpperCase(),
      paymentMethod: 'stripe-card',
      status: 'pending',
      description: `Payment for Bravant Movers - Booking ${bookingId || 'N/A'}`
    });

    await payment.save();

    if (!stripe) {
      return res.status(500).json({
        success: false,
        error: 'Stripe is not configured'
      });
    }

    // Create Stripe PaymentIntent - for KES, Stripe accepts the amount directly
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // KES amount (no cents conversion needed)
      currency: currency.toLowerCase(),
      metadata: {
        paymentId: payment._id.toString(),
        bookingId: bookingId || '',
        customerEmail
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Update payment with Stripe ID
    payment.stripePaymentIntentId = paymentIntent.id;
    await payment.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Stripe payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment'
    });
  }
};

// Confirm Stripe Payment (webhook handler)
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, status } = req.body;

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    if (status === 'succeeded') {
      payment.status = 'completed';
      payment.completedAt = Date.now();
      await payment.save();

      // Update booking payment status if linked
      if (payment.booking) {
        await Booking.findByIdAndUpdate(payment.booking, {
          paymentStatus: 'paid',
          paymentMethod: 'credit-card'
        });
      }

      // Send confirmation email
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'Bravant Movers <noreply@bravantmovers.com>',
          to: payment.customerEmail,
          subject: 'Payment Confirmed - Bravant Movers & Cleaners',
          html: `
            <h1>Payment Successful!</h1>
            <p>Dear ${payment.customerName},</p>
            <p>Your payment has been confirmed.</p>
            <p><strong>Amount:</strong> KES ${payment.amount.toLocaleString()}</p>
            <p><strong>Payment ID:</strong> ${payment._id}</p>
            <p>Thank you for choosing Bravant Movers!</p>
          `
        });
      } catch (emailError) {
        console.error('Payment confirmation email error:', emailError);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment'
    });
  }
};

// Create PesaPal Payment
exports.createPesapalPayment = async (req, res) => {
  try {
    const { amount, bookingId, customerEmail, customerName, customerPhone, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const mode = process.env.PESAPAL_MODE || 'sandbox';

    if (!consumerKey || !consumerSecret) {
      return res.status(500).json({
        success: false,
        error: 'PesaPal is not configured'
      });
    }

    // Create payment record
    const payment = new Payment({
      booking: bookingId,
      customerName,
      customerEmail,
      customerPhone,
      amount: amount,
      currency: 'KES',
      paymentMethod: 'pesapal',
      status: 'pending',
      description: description || 'Bravant Movers Payment'
    });

    await payment.save();

    // Get PesaPal token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    const tokenResponse = await axios.post(
      `${mode === 'sandbox' ? 'https://uat.pesapal.com' : 'https://www.pesapal.com'}/api/Auth/RequestToken`,
      {},
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const pesapalToken = tokenResponse.data.token;

    // Create PesaPal order
    const orderRequest = {
      consumer_key: consumerKey,
      signature_method: 'HMAC_SHA256',
      timestamp: new Date().toISOString(),
      oauth_token: pesapalToken,
      OrderTRackingId: payment._id.toString(),
      Amount: amount,
      Currency: 'KES',
      Description: description || 'Bravant Movers Payment',
      Type: 'MERCHANT',
      Reference: payment._id.toString(),
      PhoneNumber: customerPhone,
      Email: customerEmail,
      CallbackURL: process.env.PESAPAL_CALLBACK_URL || 'http://localhost:3000/api/payments/pesapal-callback',
      NotificationURL: process.env.PESAPAL_CALLBACK_URL || 'http://localhost:3000/api/payments/pesapal-notify'
    };

    const orderResponse = await axios.post(
      `${mode === 'sandbox' ? 'https://uat.pesapal.com' : 'https://www.pesapal.com'}/api/PostOrderToPayPal`,
      orderRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    payment.pesapalOrderId = orderResponse.data.order_tracking_id;
    await payment.save();

    res.status(200).json({
      success: true,
      redirectUrl: orderResponse.data.redirect_url,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('PesaPal payment error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create PesaPal payment'
    });
  }
};

// PesaPal Callback
exports.pesapalCallback = async (req, res) => {
  try {
    const { OrderTrackingId, TransactionTrackingId, Status } = req.body;

    const payment = await Payment.findOne({ _id: OrderTrackingId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    payment.pesapalTransactionId = TransactionTrackingId;

    // Map PesaPal status to our status
    const statusMap = {
      'COMPLETED': 'completed',
      'FAILED': 'failed',
      'PENDING': 'processing',
      'INVALID': 'failed'
    };

    payment.status = statusMap[Status] || 'pending';

    if (payment.status === 'completed') {
      payment.completedAt = Date.now();
      
      // Update booking payment status if linked
      if (payment.booking) {
        await Booking.findByIdAndUpdate(payment.booking, {
          paymentStatus: 'paid',
          paymentMethod: 'pesapal'
        });
      }
    }

    await payment.save();

    res.json({ success: true });
  } catch (error) {
    console.error('PesaPal callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process callback'
    });
  }
};

// Record Cash Payment
exports.recordCashPayment = async (req, res) => {
  try {
    const { bookingId, amount, customerEmail, customerName, customerPhone, notes } = req.body;

    const payment = new Payment({
      booking: bookingId,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      currency: 'KES',
      paymentMethod: 'cash',
      status: 'completed',
      completedAt: Date.now(),
      description: notes || 'Cash payment for Bravant Movers'
    });

    await payment.save();

    // Update booking payment status if linked
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'paid',
        paymentMethod: 'cash'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Cash payment recorded successfully',
      payment
    });
  } catch (error) {
    console.error('Cash payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record cash payment'
    });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment'
    });
  }
};

// Get all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const { status, paymentMethod, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const payments = await Payment.find(query)
      .populate('booking')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payments'
    });
  }
};

// Refund payment (admin)
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Can only refund completed payments'
      });
    }

    // Process refund based on payment method
    if (payment.paymentMethod === 'stripe-card' && payment.stripePaymentIntentId) {
      if (!stripe) {
        return res.status(500).json({
          success: false,
          error: 'Stripe is not configured'
        });
      }

      await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId
      });
    }

    // Update payment status
    payment.status = 'refunded';
    payment.refundedAt = Date.now();
    await payment.save();

    // Update booking payment status if linked
    if (payment.booking) {
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: 'refunded'
      });
    }

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      payment
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refund payment'
    });
  }
};

// Get payment statistics (admin)
exports.getPaymentStats = async (req, res) => {
  try {
    // Debug logs
    const totalPayments = await Payment.countDocuments();
    console.log(`[PAYMENT STATS DEBUG] Total payments count: ${totalPayments}`);

    const samplePayments = await Payment.find().select('status amount _id createdAt').limit(5);
    console.log(`[PAYMENT STATS DEBUG] Sample payments:`, JSON.stringify(samplePayments, null, 2));

    const stats = await Payment.aggregate([
      {
        $addFields: {
          statusLower: { $toLower: '$status' }
        }
      },
      {
        $group: {
          _id: '$statusLower',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          sampleStatuses: { $first: '$status' } // Keep original case sample
        }
      }
    ]);
    console.log(`[PAYMENT STATS DEBUG] Aggregated by status:`, JSON.stringify(stats, null, 2));

    const methodStats = await Payment.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const completedPayments = await Payment.aggregate([
      {
        $addFields: {
          statusLower: { $toLower: '$status' }
        }
      },
      {
        $match: { statusLower: 'completed' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    console.log(`[PAYMENT STATS DEBUG] Completed payments aggregate:`, JSON.stringify(completedPayments, null, 2));

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        byMethod: methodStats,
        totalRevenue: completedPayments[0]?.total || 0,
        totalTransactions: completedPayments[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment statistics'
    });
  }
};

// Update payment status (admin)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    const oldStatus = payment.status;
    payment.status = status;

    if (status === 'completed' && oldStatus !== 'completed') {
      payment.completedAt = Date.now();
    }

    await payment.save();

    // Update booking payment status if linked
    if (payment.booking) {
      let bookingPaymentStatus = 'unpaid';
      if (status === 'completed') {
        bookingPaymentStatus = 'paid';
      } else if (status === 'refunded') {
        bookingPaymentStatus = 'refunded';
      } else if (status === 'failed') {
        bookingPaymentStatus = 'failed';
      }
      
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: bookingPaymentStatus
      });
    }

    res.json({
      success: true,
      message: `Payment status updated from ${oldStatus} to ${status}`,
      payment
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment status'
    });
  }
};

