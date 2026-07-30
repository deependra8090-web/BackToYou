module.exports = {
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: String,
  googleId: String,
  createdAt: { type: Date, default: Date.now }
};
