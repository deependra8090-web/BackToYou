const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { findMatchesForItem } = require('../services/aiMatcher');
const { uploadImage } = require('../services/cloudinaryService');
const { sendNotificationEmail } = require('../services/emailService');

// Advanced Search & Filter Items
router.get('/', (req, res) => {
  const { search, category, type, status, minReward, dateFrom } = req.query;
  let items = db.getItems();

  // Search keyword filter
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
      (item.location && item.location.address.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (category && category !== 'All') {
    items = items.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  // Type filter (lost vs found)
  if (type && type !== 'all') {
    items = items.filter(item => item.type === type);
  }

  // Status filter (lost, found, claimed, returned)
  if (status && status !== 'all') {
    items = items.filter(item => item.status === status);
  }

  res.json({ success: true, count: items.length, items });
});

// Single Item Detail
router.get('/:id', (req, res) => {
  const items = db.getItems();
  const item = items.find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ success: true, item });
});

// Create Item (Report Lost or Found)
router.post('/', async (req, res) => {
  try {
    const { title, description, category, type, location, images, reporter, proofQuestions } = req.body;

    if (!title || !description || !category || !type) {
      return res.status(400).json({ message: 'Title, description, category, and type are required' });
    }

    // Process image with Cloudinary service helper
    let processedImages = [];
    if (images && images.length > 0) {
      for (const img of images) {
        const uploadRes = await uploadImage(img);
        processedImages.push(uploadRes.url);
      }
    } else {
      processedImages.push("https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80");
    }

    const newItem = db.addItem({
      title,
      description,
      category,
      type,
      location: location || { address: "Campus Central Plaza", lat: 37.7749, lng: -122.4194 },
      images: processedImages,
      reporter: reporter || { _id: "u_user1", name: "Sarah Chen", email: "sarah.chen@university.edu" },
      proofQuestions: proofQuestions || ["Describe specific identification mark"],
      tags: title.toLowerCase().split(' ').concat(category.toLowerCase().split(' '))
    });

    // Check for AI Match triggers
    const allItems = db.getItems();
    const matches = findMatchesForItem(newItem, allItems);

    if (matches.length > 0) {
      const topMatch = matches[0];
      // Create real-time notification alert
      db.addNotification({
        userId: newItem.reporter._id,
        title: "AI Match Found! 🤖",
        message: `Your reported ${newItem.type} item '${newItem.title}' matches ${topMatch.matchScore}% with '${topMatch.matchedItem.title}'.`,
        type: "match"
      });

      // Send Email Notification
      await sendNotificationEmail({
        to: newItem.reporter.email,
        subject: `BackToYou AI Match: ${topMatch.matchScore}% Confidence Pair Found`,
        templateName: 'ai_match',
        data: {
          recipientName: newItem.reporter.name,
          title: `Match Confidence: ${topMatch.matchScore}%`,
          details: `We found a matching ${topMatch.matchedItem.type} report: "${topMatch.matchedItem.title}" at ${topMatch.matchedItem.location.address}.`
        }
      });
    }

    res.status(201).json({ success: true, item: newItem, matchesFound: matches.length });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// AI Matcher Endpoint for specific item
router.get('/:id/match', (req, res) => {
  const allItems = db.getItems();
  const targetItem = allItems.find(i => i._id === req.params.id);

  if (!targetItem) return res.status(404).json({ message: 'Item not found' });

  const matches = findMatchesForItem(targetItem, allItems);
  res.json({
    success: true,
    targetItem,
    matchCount: matches.length,
    matches
  });
});

// Update Item
router.put('/:id', (req, res) => {
  const updatedItem = db.updateItem(req.params.id, req.body);
  if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
  res.json({ success: true, item: updatedItem });
});

// Delete Item
router.delete('/:id', (req, res) => {
  const success = db.deleteItem(req.params.id);
  res.json({ success, message: 'Item deleted' });
});

module.exports = router;
