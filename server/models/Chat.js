module.exports = {
  chatId: String,
  senderId: String,
  receiverId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
};
