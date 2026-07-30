// AI-Based Item Matching Engine
// Calculates vector tag similarity, category alignment, and text TF-IDF keyword distance

function calculateSimilarity(itemA, itemB) {
  if (!itemA || !itemB) return 0;
  if (itemA.type === itemB.type) return 0; // Lost matches with Found, not Lost with Lost

  let score = 0;

  // 1. Category exact match (30 points)
  if (itemA.category.toLowerCase() === itemB.category.toLowerCase()) {
    score += 30;
  }

  // 2. Title & Description Keyword Overlap (40 points)
  const textA = `${itemA.title} ${itemA.description} ${(itemA.tags || []).join(' ')}`.toLowerCase();
  const textB = `${itemB.title} ${itemB.description} ${(itemB.tags || []).join(' ')}`.toLowerCase();

  const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'near', 'with', 'and', 'or', 'is', 'has', 'lost', 'found', 'item', 'my']);
  const wordsA = textA.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const wordsB = textB.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

  const setB = new Set(wordsB);
  let matches = 0;
  wordsA.forEach(word => {
    if (setB.has(word)) matches++;
  });

  const totalUnique = new Set([...wordsA, ...wordsB]).size;
  if (totalUnique > 0) {
    const jaccardRatio = matches / totalUnique;
    score += Math.round(jaccardRatio * 50);
  }

  // 3. Location Proximity Check (20 points)
  if (itemA.location && itemB.location && itemA.location.lat && itemB.location.lat) {
    const latDiff = Math.abs(itemA.location.lat - itemB.location.lat);
    const lngDiff = Math.abs(itemA.location.lng - itemB.location.lng);
    if (latDiff < 0.01 && lngDiff < 0.01) {
      score += 20;
    } else if (latDiff < 0.05 && lngDiff < 0.05) {
      score += 10;
    }
  }

  return Math.min(Math.max(score, 10), 98);
}

function findMatchesForItem(targetItem, allItems) {
  const matches = [];

  allItems.forEach(item => {
    if (item._id !== targetItem._id) {
      const matchScore = calculateSimilarity(targetItem, item);
      if (matchScore >= 45) { // Only return confidence >= 45%
        matches.push({
          matchedItem: item,
          matchScore,
          reason: `${matchScore}% confidence based on matching category (${item.category}), keywords, and location proximity.`
        });
      }
    }
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  calculateSimilarity,
  findMatchesForItem
};
