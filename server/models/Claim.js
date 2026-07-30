module.exports = {
  itemId: String,
  claimantId: String,
  ownerId: String,
  proofText: String,
  proofImage: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
};
