const { db } = require('../config/db');

exports.getNotifications = (req, res) => {
  res.json({ success: true, notifications: db.getNotifications(req.params.userId) });
};
