const { StatusCodes } = require("http-status-codes");
const Conversation = require("../models/conversation.schema");
const Message = require("../models/message.schema");

async function handleGetConversations(req, res) {
  try {
    const userId = req.user.sub;
    const conversations = await Conversation.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "firstname lastname email profileImage")
      .populate("matchId", "lostItemId foundItemId matchScore")
      .sort({ lastMessageAt: -1 });

    return res.status(StatusCodes.OK).json({ success: true, data: conversations });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
}

async function handleGetMessages(req, res) {
  try {
    const userId = req.user.sub;
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Verify user is participant
    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Access denied" });
    }

    const messages = await Message.find({ conversationId })
      .populate("senderId", "firstname lastname profileImage")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Mark messages as read
    await Message.updateMany(
      { conversationId, senderId: { $ne: userId }, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(StatusCodes.OK).json({ success: true, data: messages.reverse() });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
}

async function handleSendMessage(req, res) {
  try {
    const userId = req.user.sub;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Message content is required" });
    }

    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) {
      return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Access denied" });
    }

    const message = await Message.create({
      conversationId,
      senderId: userId,
      content: content.trim(),
    });

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content.trim(),
      lastMessageAt: new Date(),
    });

    const populated = await message.populate("senderId", "firstname lastname profileImage");

    // Emit via socket if available
    if (req.io) {
      req.io.to(conversationId).emit("new_message", populated);
    }

    return res.status(StatusCodes.CREATED).json({ success: true, data: populated });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
}

module.exports = { handleGetConversations, handleGetMessages, handleSendMessage };
