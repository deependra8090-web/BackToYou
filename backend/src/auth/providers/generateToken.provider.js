const jwt = require("jsonwebtoken");

function getTokenTtlSeconds() {
  const rawValue = process.env.JWT_ACCESS_EXPIRATION_TTL ?? process.env.JWT_EXPIRES_IN ?? "86400";
  const value = String(rawValue).trim();

  if (!value) return 86400;

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue) && numericValue > 0) {
    return numericValue;
  }

  const match = value.match(/^(\d+)([smhd])$/i);
  if (match) {
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return amount * (multipliers[unit] ?? 86400);
  }

  return 86400;
}

function generateTokenProvider(user) {
  const payload = {
    sub: user["_id"],
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp:
      // Get the current time in seconds since the Unix epoch (January 1, 1970)
      // Date.now() returns the current time in milliseconds, so we divide by 1000 and use Math.floor to round down to the nearest whole number
      Math.floor(Date.now() / 1000) + getTokenTtlSeconds(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
}

module.exports = generateTokenProvider;