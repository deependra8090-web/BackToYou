const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// Get messages for a specific chatId
router.get('/:chatId', (req, res) => {
  const { chatId } = req.params;
  const messages = db.getMessages().filter(m => m.chatId === chatId);
  res.json({ success: true, messages });
});

// Post a message via REST API (fallback if Socket.IO isn't active)
router.post('/', (req, res) => {
  const { chatId, senderId, senderName, receiverId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ message: 'Chat ID and message are required' });
  }

  const newMsg = db.addMessage({
    chatId,
    senderId: senderId || "u_user1",
    senderName: senderName || "Sarah Chen",
    receiverId: receiverId || "u_user2",
    message
  });

  // Notify recipient
  db.addNotification({
    userId: receiverId,
    title: "New Direct Message 💬",
    message: `${senderName || 'Someone'} sent you a message regarding an item.`,
    type: "chat"
  });

  res.status(201).json({ success: true, message: newMsg });
});

module.exports = router;
