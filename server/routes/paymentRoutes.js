const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/stripe/create', paymentController.createStripePayment);
router.post('/stripe/confirm', paymentController.confirmStripePayment);
router.post('/pesapal/create', paymentController.createPesapalPayment);
router.post('/pesapal/callback', paymentController.pesapalCallback);
router.post('/cash', paymentController.recordCashPayment);

// Admin routes
router.get('/', protect, adminOnly, paymentController.getAllPayments);
router.get('/stats', protect, adminOnly, paymentController.getPaymentStats);
router.get('/:id', protect, adminOnly, paymentController.getPaymentById);
router.put('/:id/status', protect, adminOnly, paymentController.updatePaymentStatus);
router.post('/:id/refund', protect, adminOnly, paymentController.refundPayment);

module.exports = router;
