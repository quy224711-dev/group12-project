const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

// Các route yêu cầu xác thực
router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, profileController.updateProfile);

module.exports = router;
