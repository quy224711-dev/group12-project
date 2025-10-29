const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require('../utils/cloudinary');

//  Đăng ký (Sign Up)
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email đã được đăng ký!' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Đăng nhập (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Sai mật khẩu!' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Đăng xuất (Logout)
exports.logout = (req, res) => {
  res.json({ message: 'Đăng xuất thành công (xóa token ở client).' });
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy email!' });

    // Tạo token reset mật khẩu
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    // Trả token ra để test trên Postman
    res.json({
      message: 'Token reset được tạo thành công!',
      resetToken
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Đặt lại mật khẩu bằng token reset
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload avatar (Cloudinary)
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: 'Chưa chọn ảnh!' });

      const result = await cloudinary.uploader.upload_stream(
        { folder: 'avatars' },
        async (error, uploadResult) => {
          if (error)
            return res.status(500).json({ message: 'Lỗi upload ảnh!' });

          const user = await User.findById(req.user.id);
          user.avatar = uploadResult.secure_url;
          await user.save();

          res.json({
            message: 'Upload avatar thành công!',
            avatar: user.avatar
          });
        }
      );

      result.end(req.file.buffer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
];
