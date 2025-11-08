// backend/utils/logService.js
const Log = require('../models/Log');
const User = require('../models/User'); // Import User để lấy email

const logAction = async (action, userId, emailOverride = null) => {
  try {
    let userEmail = emailOverride;
    let finalUserId = userId;

    if (!userEmail && userId) {
      const user = await User.findById(userId);
      if (user) userEmail = user.email;
    }
    
    if (!userEmail) userEmail = 'unknown'; // Nếu login sai email

    await Log.create({
      userId: finalUserId,
      userEmail: userEmail,
      action: action,
    });
  } catch (err) {
    console.error("Lỗi khi ghi log:", err.message);
  }
};

module.exports = { logAction };