const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/upload-avatar',protect, authController.uploadAvatar);

module.exports = router;
