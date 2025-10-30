const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

// Test log
console.log('🔍 adminRoutes check:', {
  protect: authMiddleware.protect,
  getAllUsers: adminController.getAllUsers,
  deleteUser: adminController.deleteUser
});

// ✅ Moderator trở lên có thể xem danh sách user
router.get('/users', authMiddleware.protect, checkRole('moderator'), adminController.getAllUsers);

// ✅ Chỉ Admin mới được xóa user
router.delete('/users/:id', authMiddleware.protect, checkRole('admin'), adminController.deleteUser);

module.exports = router;
