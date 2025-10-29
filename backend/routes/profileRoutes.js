const { getProfile, updateProfile, changePassword, uploadAvatar } = require('../controllers/profileController');
const { protect } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/upload-avatar', protect, uploadAvatar);

module.exports = router;
