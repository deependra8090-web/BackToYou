const express = require("express");
const authenticateToken = require("../middleware/authenticateToken.middleware.js");
const { handleGetConversations, handleGetMessages, handleSendMessage } = require("./chat.controller");

const router = express.Router();

router.get("/conversations", authenticateToken, handleGetConversations);
router.get("/conversations/:conversationId/messages", authenticateToken, handleGetMessages);
router.post("/conversations/:conversationId/messages", authenticateToken, handleSendMessage);

module.exports = router;
