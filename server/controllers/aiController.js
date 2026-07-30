const { db } = require('../config/db');
const { recommendMatches } = require('../services/aiService');

exports.getRecommendations = (req, res) => {
  const item = db.getItems().find(i => i._id === req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  const matches = recommendMatches(item, db.getItems());
  res.json({ success: true, matches });
};
