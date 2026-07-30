const { db } = require('../config/db');

function createNotification(userId, title, message, type = 'info') {
  return db.addNotification({ userId, title, message, type });
}

module.exports = { createNotification };
