module.exports = {
  userId: String,
  title: String,
  message: String,
  type: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
};
