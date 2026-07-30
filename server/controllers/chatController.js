const { db } = require('../config/db');

exports.getMessages = (req, res) => {
  const msgs = db.getMessages().filter(m => m.chatId === req.params.chatId);
  res.json({ success: true, messages: msgs });
};

exports.sendMessage = (req, res) => {
  const msg = db.addMessage(req.body);
  res.status(201).json({ success: true, message: msg });
};
