const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 🔹 Định nghĩa schema người dùng
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // kiểm tra trùng email
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // yêu cầu tối thiểu 6 ký tự
  },
  role: {
    type: String,
    enum: ["admin", "manager", "user"], // các vai trò hệ thống
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔹 Tự động mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Hàm so sánh mật khẩu khi login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
