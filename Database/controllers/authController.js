// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ Hàm tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    "secret_key_example", // ⚠️ Nên lưu trong .env
    { expiresIn: "1h" }
  );
};

// 🧩 [POST] /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });

    // Tạo user
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 🧩 [POST] /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu!" });

    const token = generateToken(user);
    res.json({ message: "Đăng nhập thành công!", token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 🧩 [POST] /api/auth/logout
exports.logout = (req, res) => {
  res.json({ message: "Đăng xuất thành công! (Client tự xóa token)" });
};
