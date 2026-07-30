const { db } = require('../config/db');

exports.getProfile = (req, res) => {
  const users = db.getUsers();
  const user = users.find(u => u._id === req.params.id) || users[0];
  res.json({ success: true, user });
};

exports.updateProfile = (req, res) => {
  const users = db.getUsers();
  const user = users.find(u => u._id === req.params.id);
  if (user) {
    Object.assign(user, req.body);
    return res.json({ success: true, user });
  }
  res.status(404).json({ message: 'User not found' });
};
