const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Protected routes (require authentication)
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.put('/password', protect, userController.updatePassword);
router.get('/addresses', protect, userController.getSavedAddresses);
router.post('/addresses', protect, userController.addSavedAddress);
router.put('/addresses/:id', protect, userController.updateSavedAddress);
router.delete('/addresses/:id', protect, userController.deleteSavedAddress);

module.exports = router;
