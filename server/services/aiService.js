const { findMatchesForItem } = require('./aiMatcher');

function calculateSimilarity(itemA, itemB) {
  if (!itemA || !itemB || itemA.type === itemB.type) return 0;
  let score = 0;
  if (itemA.category.toLowerCase() === itemB.category.toLowerCase()) score += 30;

  const textA = `${itemA.title} ${itemA.description}`.toLowerCase();
  const textB = `${itemB.title} ${itemB.description}`.toLowerCase();
  
  const wordsA = textA.split(/\s+/);
  const setB = new Set(textB.split(/\s+/));
  let matches = 0;
  wordsA.forEach(w => { if (setB.has(w)) matches++; });

  score += Math.min(matches * 10, 50);
  return Math.min(Math.max(score, 15), 96);
}

function recommendMatches(targetItem, allItems) {
  const results = [];
  allItems.forEach(item => {
    if (item._id !== targetItem._id) {
      const matchScore = calculateSimilarity(targetItem, item);
      if (matchScore >= 40) {
        results.push({ matchedItem: item, matchScore, reason: `${matchScore}% tag & category overlap` });
      }
    }
  });
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { calculateSimilarity, recommendMatches };
