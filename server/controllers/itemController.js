const { db } = require('../config/db');
const { recommendMatches } = require('../services/aiService');

exports.getItems = (req, res) => {
  const { search, category, type } = req.query;
  let items = db.getItems();

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }
  if (category && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }
  if (type && type !== 'all') {
    items = items.filter(i => i.type === type);
  }

  res.json({ success: true, count: items.length, items });
};

exports.getItemById = (req, res) => {
  const item = db.getItems().find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ success: true, item });
};

exports.createItem = (req, res) => {
  const newItem = db.addItem(req.body);
  const matches = recommendMatches(newItem, db.getItems());
  res.status(201).json({ success: true, item: newItem, matches });
};

exports.updateItem = (req, res) => {
  const updated = db.updateItem(req.params.id, req.body);
  res.json({ success: true, item: updated });
};

exports.deleteItem = (req, res) => {
  db.deleteItem(req.params.id);
  res.json({ success: true, message: 'Item deleted' });
};
