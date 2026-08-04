const Item = require("../items/items.schema");

// ─── TF-IDF text similarity helper ─────────────────────────────────────────
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(tokensA, tokensB) {
  if (!tokensA.length && !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function textSimilarity(a, b) {
  const tA = tokenize(a);
  const tB = tokenize(b);
  return jaccardSimilarity(tA, tB);
}

function keywordSimilarity(kA = [], kB = []) {
  const arrA = Array.isArray(kA) ? kA : typeof kA === "string" ? [kA] : [];
  const arrB = Array.isArray(kB) ? kB : typeof kB === "string" ? [kB] : [];
  const setA = new Set(arrA.map((k) => k.toLowerCase()));
  const setB = new Set(arrB.map((k) => k.toLowerCase()));
  if (!setA.size && !setB.size) return 0;
  const intersection = [...setA].filter((k) => setB.has(k)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

function aiTagSimilarity(tagsA = [], tagsB = []) {
  const arrA = Array.isArray(tagsA) ? tagsA : typeof tagsA === "string" ? [tagsA] : [];
  const arrB = Array.isArray(tagsB) ? tagsB : typeof tagsB === "string" ? [tagsB] : [];
  const setA = new Set(arrA.map((t) => t.toLowerCase()));
  const setB = new Set(arrB.map((t) => t.toLowerCase()));
  if (!setA.size && !setB.size) return 0;
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

// ─── Main Match Engine ──────────────────────────────────────────────────────
async function matchEngine(baseItem) {
  const oppositeType = baseItem.type === "lost" ? "found" : "lost";

  const candidates = await Item.find({
    type: oppositeType,
    category: baseItem.category,
    status: "approved",
    isActive: true,
    _id: { $ne: baseItem._id },
  });

  const matches = [];

  for (let c of candidates) {
    let score = 0;
    const reasons = [];

    // ── 1. Category match (always true here since we filter by it) — 20 pts
    score += 20;
    reasons.push("Same category");

    // ── 2. Location match — 15 pts
    if (
      baseItem.location &&
      c.location &&
      baseItem.location.toLowerCase().trim() === c.location.toLowerCase().trim()
    ) {
      score += 15;
      reasons.push("Same location");
    }

    // ── 3. AI Text similarity: title + description — up to 30 pts
    const titleSim = textSimilarity(baseItem.title, c.title);
    const descSim  = textSimilarity(baseItem.description, c.description);
    const combinedTextSim = titleSim * 0.6 + descSim * 0.4;
    const textScore = Math.round(combinedTextSim * 30);
    if (textScore > 0) {
      score += textScore;
      reasons.push(`Description match ${Math.round(combinedTextSim * 100)}%`);
    }

    // ── 4. Keyword overlap — up to 20 pts
    const kwSim = keywordSimilarity(baseItem.keywords, c.keywords);
    const kwScore = Math.round(kwSim * 20);
    if (kwScore > 0) {
      score += kwScore;
      reasons.push(`Keyword match ${Math.round(kwSim * 100)}%`);
    }

    // ── 5. AI image tag similarity (Cloudinary auto_tagging) — up to 10 pts
    const tagSim = aiTagSimilarity(baseItem.aiTags, c.aiTags);
    const tagScore = Math.round(tagSim * 10);
    if (tagScore > 0) {
      score += tagScore;
      reasons.push(`Image tag match ${Math.round(tagSim * 100)}%`);
    }

    // ── 6. Color match — 5 pts
    const colorA = baseItem.identifiableAttributes?.color?.toLowerCase();
    const colorC = c.identifiableAttributes?.color?.toLowerCase();
    if (colorA && colorC && colorA === colorC) {
      score += 5;
      reasons.push("Same color");
    }

    // ── 7. Date proximity — up to 10 pts
    if (baseItem.date && c.date) {
      const diffDays = Math.abs(new Date(baseItem.date) - new Date(c.date)) / (1000 * 60 * 60 * 24);
      if (diffDays <= 1) {
        score += 10;
        reasons.push("Same day");
      } else if (diffDays <= 3) {
        score += 7;
        reasons.push("Within 3 days");
      } else if (diffDays <= 7) {
        score += 4;
        reasons.push("Within a week");
      }
    }

    // Clamp to 100
    score = Math.min(100, score);

    // Only include if score meets threshold
    if (score >= 35) {
      matches.push({
        lostItemId:  baseItem.type === "lost" ? baseItem._id : c._id,
        foundItemId: baseItem.type === "found" ? baseItem._id : c._id,
        matchScore:  score,
        matchReason: reasons.join(" · "),
      });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

module.exports = matchEngine;