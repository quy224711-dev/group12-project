const { getProfile, updateProfile, changePassword, uploadAvatar,getAdminLogs } = require('../controllers/profileController');
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware'); // 👈 Đảm bảo có adminOnly
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/upload-avatar', protect, uploadAvatar);

router.get('/admin/logs', protect, adminOnly, getAdminLogs);
module.exports = router;
