const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/quote', bookingController.calculateQuote);
router.post('/', bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);

// Protected routes (require authentication)
router.get('/user/:userId', protect, bookingController.getUserBookings);
router.put('/:id', protect, bookingController.updateBooking);
router.delete('/:id', protect, bookingController.cancelBooking);

// Admin routes (require admin role)
router.get('/', protect, adminOnly, bookingController.getAllBookings);
router.get('/stats', protect, adminOnly, bookingController.getBookingStats);
router.put('/:id/status', protect, adminOnly, bookingController.updateBookingStatus);
router.put('/:id/payment', protect, adminOnly, bookingController.updatePaymentStatus);

module.exports = router;
