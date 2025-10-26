const { protect } = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');
const express = require('express');
const router = express.Router();

// Các route yêu cầu xác thực
router.get('/profile', protect, profileController.getProfile);
router.put('/profile', protect, profileController.updateProfile);

module.exports = router;
