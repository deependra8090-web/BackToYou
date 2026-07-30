const { db } = require('../config/db');

exports.getClaims = (req, res) => {
  res.json({ success: true, claims: db.getClaims() });
};

exports.submitClaim = (req, res) => {
  const claim = db.addClaim(req.body);
  res.status(201).json({ success: true, claim });
};

exports.updateClaimStatus = (req, res) => {
  const claim = db.updateClaimStatus(req.params.id, req.body.status);
  res.json({ success: true, claim });
};
