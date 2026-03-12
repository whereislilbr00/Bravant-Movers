const Contact = require('../models/Contact');
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

// Create new contact submission
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide name, email, and message' 
      });
    }

    // Create contact record
    const contact = new Contact({
      name,
      email,
      phone,
      service: service || 'general',
      message,
      source: 'website',
      status: 'new'
    });

    await contact.save();

    // Send confirmation email to customer
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'Bravant Movers <noreply@bravantmovers.com>',
        to: email,
        subject: 'Thank you for contacting Bravant Movers & Cleaners',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Contacting Us!</h1>
              </div>
              <div class="content">
                <p>Dear <strong>${name}</strong>,</p>
                <p>We have received your message and would like to thank you for reaching out to Bravant Movers & Cleaners.</p>
                <p><strong>Your Inquiry:</strong></p>
                <p>${message}</p>
                <p>Our team will review your message and get back to you within 24-48 hours.</p>
                <p>If you have an urgent inquiry, please call us at <strong>(555) 123-4567</strong></p>
                <br>
                <p>Best regards,</p>
                <p><strong>The Bravant Movers Team</strong></p>
              </div>
              <div class="footer">
                <p>Bravant Movers & Cleaners | Professional Moving & Cleaning Services</p>
                <p>This is an automated response. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (emailError) {
      console.error('Customer confirmation email error:', emailError);
    }

    // Send notification to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'Bravant Movers <noreply@bravantmovers.com>',
        to: process.env.ADMIN_EMAIL || 'admin@bravantmovers.com',
        subject: `New Contact Form Submission - ${service || 'General'}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service Interest:</strong> ${service || 'General'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    } catch (emailError) {
      console.error('Admin notification email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        status: contact.status
      }
    });
  } catch (error) {
    console.error('Contact creation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit contact form. Please try again later.' 
    });
  }
};

// Get all contacts (admin)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, source, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (source) {
      query.source = source;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get contacts' 
    });
  }
};

// Get single contact (admin)
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false,
        error: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get contact' 
    });
  }
};

// Update contact status (admin)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        adminNotes,
        ...(status === 'replied' ? { repliedAt: Date.now() } : {}),
        updatedAt: Date.now() 
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ 
        success: false,
        error: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated',
      contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update contact' 
    });
  }
};

// Delete contact (admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false,
        error: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete contact' 
    });
  }
};

// Get contact statistics (admin)
exports.getContactStats = async (req, res) => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalContacts = await Contact.countDocuments();

    const sourceStats = await Contact.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        bySource: sourceStats,
        totalContacts
      }
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get statistics' 
    });
  }
};
