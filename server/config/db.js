const { db } = require('./dualStore');
require('dotenv').config();

module.exports = {
  connectDB: async () => {
    const uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      try {
        const mongoose = require('mongoose');
        await mongoose.connect(uri);
        console.log("🟢 [MONGODB] Connected to MongoDB database successfully!");
        return;
      } catch (error) {
        console.warn("⚠️ [MONGODB] Failed to connect to MongoDB URI. Falling back to DualStore.");
        console.warn(`Reason: ${error.message}`);
      }
    }

    console.log("⚡ [CONFIG] Running with DualStore (In-Memory Database + Mock Data)");
    console.log("💡 [TIP] To connect to MongoDB, add MONGODB_URI to server/.env");
  },
  db
};

