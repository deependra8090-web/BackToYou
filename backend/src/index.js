const path = require("path");
const dotenv = require("dotenv");

// Set the default environment
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Current Environment: ${process.env.NODE_ENV}`);

// Load base .env first, then override with environment-specific file if present.
const baseEnvFile = path.resolve(__dirname, "..", ".env");
const envFile = path.resolve(__dirname, "..", `.env.${process.env.NODE_ENV}`);

const baseEnv = dotenv.config({ path: baseEnvFile });
if (baseEnv.error) {
  console.warn(`Could not load base env file at ${baseEnvFile}.`);
}

const envResult = dotenv.config({ path: envFile, override: true });
if (envResult.error) {
  console.warn(`Could not load environment-specific env file at ${envFile}. Using base .env values if available.`);
}

console.log(`Loaded environment variables from: ${baseEnvFile}${envResult.error ? "" : ` and ${envFile}`}`);

const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const configureApp = require("./settings/config.js");
const seedAdmin  = require("./seeders/seedAdmin.js");

const app = express();
const server = http.createServer(app);

const port = parseInt(process.env.PORT) || 3001;

// ─── Socket.io Setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: [
      "https://back-to-you-xe9m.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Authenticate socket connections via JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user?.sub;
  console.log(`🔌 Socket connected: ${userId}`);

  // Join a conversation room
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${userId} joined conversation: ${conversationId}`);
  });

  // Leave a conversation room
  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
  });

  // Typing indicator
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit("user_typing", { userId, isTyping });
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${userId}`);
  });
});

// Make io available to route handlers via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

//  Parsing request body
app.use(express.json());
configureApp(app);

async function bootstrap() {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL,
      { dbName: process.env.DATABASE_NAME }
    );
    console.log("Connected To MongoDB");

    // Seed default admin once — reuses the existing connection
    await seedAdmin();

    server.listen(port, () => {
      console.log(`🚀 BackToYou server listening on port ${port}`);
      console.log(`💬 Socket.io ready`);
    });

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

bootstrap();
