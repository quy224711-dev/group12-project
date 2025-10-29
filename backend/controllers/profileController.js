const User = require('../models/User');
const bcrypt = require('bcryptjs');

// [GET] /api/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// [PUT] /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const updateData = { name, email, avatar };

    // Nếu có thay đổi mật khẩu → mã hóa lại
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: 'Cập nhật thành công', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};
