// backend/models/Log.js
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userEmail: { type: String, required: true }, // Luôn ghi lại email
  action: { type: String, required: true }, // 'login_success', 'login_fail_pass',...
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);