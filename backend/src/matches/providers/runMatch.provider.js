const Item = require("../../items/items.schema");
const Match = require("../matches.schema");
const matchEngine = require("../../helpers/matchItem.helper");
const User = require("../../models/users.schema");
const { sendMatchFoundEmail } = require("../../services/email.service");

async function runMatchProvider(itemId) {
  // 1. Fetch item
  const item = await Item.findById(itemId).populate("postedBy", "email firstname lastname");

  if (!item) {
    throw new Error("Item not found");
  }

  // 2. Eligibility check
  if (item.status !== "approved" || !item.isActive) {
    throw new Error("Item is not eligible for matching");
  }

  // 3. Run AI matching engine
  const results = await matchEngine(item);

  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  // 4. Normalize + clamp scores
  const normalizedResults = results.map((m) => ({
    ...m,
    matchScore: Math.max(0, Math.min(100, Number(m.matchScore) || 0)),
  }));

  // 5. Fetch existing matches in ONE query (optimization)
  const existingMatches = await Match.find({
    $or: normalizedResults.map((m) => ({
      lostItemId: m.lostItemId,
      foundItemId: m.foundItemId,
    })),
  }).select("lostItemId foundItemId");

  const existingSet = new Set(
    existingMatches.map(
      (m) => `${m.lostItemId.toString()}-${m.foundItemId.toString()}`
    )
  );

  // 6. Filter duplicates in memory (fast)
  const filteredMatches = normalizedResults.filter((m) => {
    const key = `${m.lostItemId}-${m.foundItemId}`;
    return !existingSet.has(key);
  });

  if (filteredMatches.length === 0) {
    return [];
  }

  // 7. Insert matches
  const created = await Match.insertMany(filteredMatches);

  // 8. Send email notifications (non-blocking)
  try {
    const appUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    for (const match of created) {
      // Get both items with their owners
      const [lostItem, foundItem] = await Promise.all([
        Item.findById(match.lostItemId).populate("postedBy", "email firstname"),
        Item.findById(match.foundItemId).populate("postedBy", "email firstname"),
      ]);

      // Notify the lost-item owner
      if (lostItem?.postedBy?.email) {
        sendMatchFoundEmail({
          userEmail: lostItem?.postedBy?.email,
          userName: lostItem?.postedBy?.firstname || "there",
          lostItemTitle: lostItem?.title || "a lost item",
          foundItemTitle: foundItem?.title || "a found item",
          matchScore: match.matchScore,
          appUrl,
        }).catch((err) => console.error("Email error:", err.message));
      }

      // Notify the found-item owner too
      if (foundItem?.postedBy?.email && foundItem?.postedBy?.email !== lostItem?.postedBy?.email) {
        sendMatchFoundEmail({
          userEmail: foundItem?.postedBy?.email,
          userName: foundItem?.postedBy?.firstname || "there",
          lostItemTitle: lostItem?.title || "a lost item",
          foundItemTitle: foundItem?.title || "a found item",
          matchScore: match.matchScore,
          appUrl,
        }).catch((err) => console.error("Email error:", err.message));
      }
    }
  } catch (emailErr) {
    // Email errors should never block match creation
    console.error("Email notification error:", emailErr.message);
  }

  return created;
}

module.exports = runMatchProvider;