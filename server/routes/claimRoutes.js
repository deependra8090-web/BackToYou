const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { sendNotificationEmail } = require('../services/emailService');

// Get all claims (Filtered by user or admin)
router.get('/', (req, res) => {
  const { userId, role } = req.query;
  let claims = db.getClaims();

  if (role !== 'admin' && userId) {
    claims = claims.filter(c => c.claimantId === userId);
  }

  res.json({ success: true, count: claims.length, claims });
});

// Submit a Claim for Verification Workflow
router.post('/', async (req, res) => {
  const { itemId, claimantId, claimantName, claimantEmail, proofText, proofImage } = req.body;

  if (!itemId || !proofText) {
    return res.status(400).json({ message: 'Item ID and verification proof are required' });
  }

  const items = db.getItems();
  const item = items.find(i => i._id === itemId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  const newClaim = db.addClaim({
    itemId,
    itemTitle: item.title,
    itemCategory: item.category,
    claimantId: claimantId || "u_user1",
    claimantName: claimantName || "Sarah Chen",
    claimantEmail: claimantEmail || "sarah.chen@university.edu",
    ownerId: item.reporter._id,
    proofText,
    proofImage: proofImage || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
  });

  // Notify Item Reporter/Owner
  db.addNotification({
    userId: item.reporter._id,
    title: "New Item Claim Submitted 📩",
    message: `${claimantName || 'A user'} submitted proof of ownership for '${item.title}'.`,
    type: "claim"
  });

  await sendNotificationEmail({
    to: item.reporter.email,
    subject: `Claim Request for '${item.title}'`,
    templateName: 'claim_submitted',
    data: {
      recipientName: item.reporter.name,
      title: 'Action Required: Review Claim Proof',
      details: `${claimantName || 'A user'} submitted verification details. Log into your dashboard to approve or reject.`
    }
  });

  res.status(201).json({ success: true, claim: newClaim });
});

// Update Claim Status (Approve / Reject)
router.put('/:id/status', async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const claim = db.updateClaimStatus(req.params.id, status);

  if (!claim) return res.status(404).json({ message: 'Claim not found' });

  // Notify Claimant
  db.addNotification({
    userId: claim.claimantId,
    title: status === 'approved' ? "Claim Approved! 🎉" : "Claim Update ⚠️",
    message: status === 'approved' 
      ? `Your claim for '${claim.itemTitle}' has been approved! Check chat for pickup details.`
      : `Your claim for '${claim.itemTitle}' was reviewed and requires additional proof.`,
    type: "claim_status"
  });

  await sendNotificationEmail({
    to: claim.claimantEmail,
    subject: `Claim Status Update: ${status.toUpperCase()}`,
    templateName: 'claim_status',
    data: {
      recipientName: claim.claimantName,
      title: `Claim ${status.toUpperCase()}`,
      details: status === 'approved' 
        ? `Congratulations! Your claim for "${claim.itemTitle}" was approved. You can now coordinate handover via chat.`
        : `Your claim for "${claim.itemTitle}" was rejected due to incomplete proof of ownership.`
    }
  });

  res.json({ success: true, claim });
});

module.exports = router;
