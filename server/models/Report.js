module.exports = {
  itemId: String,
  reporterId: String,
  reason: String,
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
};
