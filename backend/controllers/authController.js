const { logAction } = require('../utils/logService');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');
const RefreshToken = require('../models/RefreshToken');

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
    await logAction('register', newUser._id, email);

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// 2️⃣ Đăng nhập (Login) - FIXED
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      await logAction('login_fail_email', null, email);
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logAction('login_fail_password', user._id, user.email);
      return res.status(400).json({ message: 'Sai mật khẩu!' });
    }

    // ✅ FIX: Access Token (1 phút) - userId phải là "userId" không phải "id"
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role }, // 👈 ĐỔI TỪ "id" THÀNH "userId"
      process.env.JWT_SECRET,
      { expiresIn: '1m' }
    );

    // ✅ FIX: Refresh Token (7 ngày) - userId phải khớp với protect middleware
    const refreshToken = jwt.sign(
      { userId: user._id }, // 👈 ĐỔI TỪ "id" THÀNH "userId"
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Lưu Refresh Token vào DB
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await logAction('login_success', user._id, user.email);

    // ✅ FIX: Trả về đầy đủ thông tin user
    res.json({
      message: 'Đăng nhập thành công!',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// 3️⃣ Refresh Token API - FIXED
// =========================
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: 'Thiếu refresh token!' });

    // ✅ FIX 1: Kiểm tra token trong DB trước
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken)
      return res.status(403).json({ message: 'Refresh token không hợp lệ!' });

    // ✅ FIX 2: Verify token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: 'Refresh token hết hạn!' });

      // ✅ FIX 3: Lấy thông tin user từ DB
      const user = await User.findById(decoded.userId);
      if (!user)
        return res.status(404).json({ message: 'User không tồn tại!' });

      // ✅ FIX 4: Tạo Access Token mới (phải có userId và role)
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, role: user.role }, // 👈 THÊM role
        process.env.JWT_SECRET,
        { expiresIn: '1m' }
      );

      // ✅ FIX 5: Trả về cả user info để frontend không mất state
      res.json({
        message: 'Cấp mới Access Token thành công!',
        accessToken: newAccessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || null
        }
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
    
    // ✅ Log activity nếu có user
    if (req.user) {
      await logAction('logout', req.user.userId, req.user.email);
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
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
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
      // ✅ FIX: Dùng req.user.userId thay vì req.user.id
      const user = await User.findById(req.user.userId);
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
