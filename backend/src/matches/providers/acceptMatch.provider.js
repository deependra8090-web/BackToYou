const Match = require("../matches.schema");

async function acceptMatchProvider(matchId, userId) {

  const match = await Match.findById(matchId)
    .populate("lostItemId")
    .populate("foundItemId");

  if (!match) {
    throw new Error("Match not found");
  }

  const isOwner =
    match.lostItemId?.postedBy?.toString() === userId ||
    match.foundItemId?.postedBy?.toString() === userId;

  if (!isOwner) {
    throw new Error("Unauthorized");
  }

  match.status = "accepted";
  await match.save();

  // Create Conversation between the two users
  const lostUser = match.lostItemId?.postedBy?.toString();
  const foundUser = match.foundItemId?.postedBy?.toString();

  if (lostUser && foundUser && lostUser !== foundUser) {
    const Conversation = require("../../models/conversation.schema");
    const existingConv = await Conversation.findOne({
      matchId: match._id,
    });

    if (!existingConv) {
      await Conversation.create({
        participants: [lostUser, foundUser],
        matchId: match._id,
        lastMessage: "Match accepted! You can now chat.",
        lastMessageAt: new Date(),
        isActive: true,
      });
    }
  }

  return match;
}

module.exports = acceptMatchProvider;