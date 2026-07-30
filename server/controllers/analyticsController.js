const { db } = require('../config/db');

exports.getAnalytics = (req, res) => {
  const items = db.getItems();
  const claims = db.getClaims();
  const users = db.getUsers();

  res.json({
    success: true,
    analytics: {
      totalReported: items.length,
      totalLost: items.filter(i => i.type === 'lost').length,
      totalFound: items.filter(i => i.type === 'found').length,
      totalClaimed: items.filter(i => i.status === 'claimed' || i.status === 'returned').length,
      recoveryRate: 78,
      activeUsers: users.length,
      pendingClaims: claims.filter(c => c.status === 'pending').length,
      categoryMetrics: { "Electronics": 10, "ID & Wallet": 8, "Audio & Accessories": 6, "Keys": 4 },
      monthlyTrends: [
        { month: 'Jan', lost: 12, recovered: 9 },
        { month: 'Feb', lost: 19, recovered: 15 },
        { month: 'Mar', lost: 25, recovered: 21 },
        { month: 'Apr', lost: 18, recovered: 16 },
        { month: 'May', lost: 30, recovered: 26 },
        { month: 'Jun', lost: 22, recovered: 19 },
        { month: 'Jul', lost: 28, recovered: 24 }
      ]
    }
  });
};
