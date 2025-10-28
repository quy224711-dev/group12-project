const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Middleware xác thực người dùng qua token
const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

// ✅ Middleware chỉ cho admin truy cập
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Chỉ admin mới được phép thực hiện hành động này' });
  }
  next();
};

// ❗ Xuất đúng cách — phải là object chứa 2 function
module.exports = { protect, adminOnly };
