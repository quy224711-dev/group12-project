const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

console.log('🔍 adminRoutes check:', {
  protect,
  adminOnly,
  getAllUsers: adminController.getAllUsers,
  deleteUser: adminController.deleteUser
});

router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.delete('/users/:id', protect, adminOnly, adminController.deleteUser);

module.exports = router;
