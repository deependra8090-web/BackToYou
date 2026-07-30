const { db } = require('../config/db');

exports.getUsers = (req, res) => {
  res.json({ success: true, users: db.getUsers() });
};

exports.deleteItem = (req, res) => {
  db.deleteItem(req.params.id);
  res.json({ success: true, message: 'Item removed by admin' });
};
