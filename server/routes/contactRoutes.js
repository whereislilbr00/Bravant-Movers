const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/', contactController.createContact);

// Admin routes
router.get('/', protect, adminOnly, contactController.getAllContacts);
router.get('/stats', protect, adminOnly, contactController.getContactStats);
router.get('/:id', protect, adminOnly, contactController.getContactById);
router.put('/:id', protect, adminOnly, contactController.updateContactStatus);
router.delete('/:id', protect, adminOnly, contactController.deleteContact);

module.exports = router;
