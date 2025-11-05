const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');
const RefreshToken = require('../models/RefreshToken'); // 🆕 thêm model refresh token

// =========================
// 1️⃣ Đăng ký (Sign Up)
// =========================
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

// =========================
// 2️⃣ Đăng nhập (Login)
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Sai mật khẩu!' });
    
    // Access Token (ngắn hạn)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );



    // Refresh Token (dài hạn)
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Lưu Refresh Token vào DB
    await RefreshToken.create({
  userId: user._id,
  token: refreshToken,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // hết hạn sau 7 ngày
});

    res.json({
      message: 'Đăng nhập thành công!',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// 3️⃣ Refresh Token API
// =========================
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: 'Thiếu refresh token!' });

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: 'Refresh token không hợp lệ!' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: 'Refresh token hết hạn!' });

      // Tạo Access Token mới
      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({
        message: 'Cấp mới Access Token thành công!',
        accessToken: newAccessToken
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// 4️⃣ Đăng xuất (Logout)
// =========================
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    res.json({ message: 'Đăng xuất thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// 5️⃣ Quên mật khẩu (Forgot Password)
// =========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy email!' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    res.json({ message: 'Token reset được tạo thành công!', resetLink });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// 6️⃣ Đặt lại mật khẩu (Reset Password)
// =========================
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

// =========================
// 7️⃣ Upload avatar (Cloudinary)
// =========================
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: 'Chưa chọn ảnh!' });

      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'avatars' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      const user = await User.findById(req.user.id);
      user.avatar = result.secure_url;
      await user.save();

      res.json({
        message: 'Upload avatar thành công!',
        avatar: result.secure_url
      });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  }
];
