const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/calculate', quoteController.calculateQuote);
router.post('/', quoteController.submitQuote);

// Admin routes
router.get('/', protect, adminOnly, quoteController.getAllQuotes);
router.get('/stats', protect, adminOnly, quoteController.getAllQuotes); // Reuse for stats
router.get('/:id', protect, adminOnly, quoteController.getQuoteById);
router.put('/:id', protect, adminOnly, quoteController.updateQuote);
router.post('/:id/send', protect, adminOnly, quoteController.sendQuote);
router.post('/:id/convert', protect, adminOnly, quoteController.convertToBooking);
router.delete('/:id', protect, adminOnly, quoteController.deleteQuote);

module.exports = router;
