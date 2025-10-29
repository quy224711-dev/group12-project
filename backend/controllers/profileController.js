const User = require('../models/User');
const bcrypt = require('bcryptjs');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

// -------------------------
// Lấy thông tin cá nhân
// -------------------------
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// -------------------------
// Cập nhật thông tin cá nhân
// -------------------------
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true
    }).select('-password');

    res.json({
      message: 'Cập nhật thành công!',
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// -------------------------
// Đổi mật khẩu (tùy chọn, người dùng đang đăng nhập)
// -------------------------
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng!' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// -------------------------
// Upload ảnh đại diện (Cloudinary)
// -------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: 'Chưa chọn ảnh!' });

      // Upload ảnh lên Cloudinary
      cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        async (error, result) => {
          if (error)
            return res.status(500).json({ message: 'Lỗi upload ảnh', error });

          const user = await User.findById(req.user.id);
          user.avatar = result.secure_url;
          await user.save();

          res.json({
            message: 'Upload avatar thành công!',
            avatar: result.secure_url
          });
        }
      ).end(req.file.buffer);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  }
];
