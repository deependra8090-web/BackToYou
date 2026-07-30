const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

// Analytics Overview
router.get('/analytics', (req, res) => {
  const items = db.getItems();
  const claims = db.getClaims();
  const users = db.getUsers();

  const totalReported = items.length;
  const totalLost = items.filter(i => i.type === 'lost').length;
  const totalFound = items.filter(i => i.type === 'found').length;
  const totalClaimed = items.filter(i => i.status === 'claimed' || i.status === 'returned').length;

  const recoveryRate = totalReported > 0 ? Math.round((totalClaimed / totalReported) * 100) : 78;

  // Category Breakdown
  const categories = {};
  items.forEach(i => {
    categories[i.category] = (categories[i.category] || 0) + 1;
  });

  // Monthly trend mock data
  const monthlyTrends = [
    { month: 'Jan', lost: 12, recovered: 9 },
    { month: 'Feb', lost: 19, recovered: 15 },
    { month: 'Mar', lost: 25, recovered: 21 },
    { month: 'Apr', lost: 18, recovered: 16 },
    { month: 'May', lost: 30, recovered: 26 },
    { month: 'Jun', lost: 22, recovered: 19 },
    { month: 'Jul', lost: 28, recovered: 24 }
  ];

  res.json({
    success: true,
    analytics: {
      totalReported,
      totalLost,
      totalFound,
      totalClaimed,
      recoveryRate,
      activeUsers: users.length,
      pendingClaims: claims.filter(c => c.status === 'pending').length,
      categoryMetrics: categories,
      monthlyTrends
    }
  });
});

// Admin User Management List
router.get('/users', (req, res) => {
  const users = db.getUsers();
  res.json({ success: true, users });
});

// Moderation: Flag or Delete Item
router.delete('/items/:id', (req, res) => {
  const success = db.deleteItem(req.params.id);
  res.json({ success, message: 'Item moderated and removed by admin' });
});

// Get User Notifications
router.get('/notifications/:userId', (req, res) => {
  const notifs = db.getNotifications(req.params.userId);
  res.json({ success: true, notifications: notifs });
});

module.exports = router;
