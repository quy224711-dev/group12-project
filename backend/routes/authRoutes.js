const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middlewares/authMiddleware'); // 👈 THÊM protect

// Rate limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authController.signup);
router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refreshToken); // ✅ THÊM route refresh
router.post('/logout', protect, authController.logout); // ✅ THÊM protect middleware
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
