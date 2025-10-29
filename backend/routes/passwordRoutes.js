const express = require('express');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

// Forgot password không cần admin, chỉ user
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);

module.exports = router;
