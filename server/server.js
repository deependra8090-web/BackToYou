const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectDB, db } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Enable Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'BackToYou Lost & Found API Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Real-Time Socket.IO Handlers
io.on('connection', (socket) => {
  console.log(`🔌 [SOCKET.IO] User connected: ${socket.id}`);

  // Join item specific chat room
  socket.on('join_room', (chatId) => {
    socket.join(chatId);
    console.log(`👥 Socket ${socket.id} joined chat room: ${chatId}`);
  });

  // Handle incoming live chat message
  socket.on('send_message', (data) => {
    const { chatId, senderId, senderName, receiverId, message } = data;
    const newMsg = db.addMessage({
      chatId,
      senderId,
      senderName,
      receiverId,
      message
    });

    // Broadcast message to room
    io.to(chatId).emit('receive_message', newMsg);

    // Push real-time notification alert
    io.emit('push_notification', {
      userId: receiverId,
      title: "New Chat Message 💬",
      message: `${senderName}: ${message.substring(0, 40)}...`,
      type: "chat"
    });
  });

  // Typing indicator broadcast
  socket.on('typing', ({ chatId, senderName, isTyping }) => {
    socket.to(chatId).emit('user_typing', { senderName, isTyping });
  });

  socket.on('disconnect', () => {
    console.log(`❌ [SOCKET.IO] User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = Number(process.env.PORT || 5000);
const PORT_FILE = path.join(__dirname, '.dev-port');

function writePortFile(port) {
  fs.writeFileSync(PORT_FILE, String(port), 'utf8');
}

function startServer(port) {
  server.removeAllListeners('error');
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < PORT + 5) {
      console.warn(`⚠️ Port ${port} is busy. Trying ${port + 1} instead.`);
      startServer(port + 1);
    } else {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  });

  server.listen(port, '127.0.0.1', () => {
    writePortFile(port);
    console.log(`🚀 BackToYou Server active on port ${port}`);
    console.log(`🌐 API Endpoint: http://localhost:${port}/api/health`);
  });
}

connectDB().then(() => {
  startServer(PORT);
});
