const mongoose = require("mongoose");

// Định nghĩa schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

// Tạo model
const User = mongoose.model("User", userSchema);

module.exports = User;
