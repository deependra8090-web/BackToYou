module.exports = {
  title: String,
  description: String,
  category: String,
  type: { type: String, enum: ['lost', 'found'] },
  status: { type: String, enum: ['lost', 'found', 'claimed', 'returned'], default: 'lost' },
  location: { address: String, lat: Number, lng: Number },
  images: [String],
  tags: [String],
  reporter: Object,
  proofQuestions: [String],
  dateReported: { type: Date, default: Date.now }
};
