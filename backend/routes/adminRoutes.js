const express = require('express');
const router = express.Router();
const { getAllUsers, getAdminStats, adminLogin } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authmiddleware');

// Login Route
router.post('/login', adminLogin);

// Admin routes
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/stats', protect, isAdmin, getAdminStats);

module.exports = router;