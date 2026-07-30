const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = { id: "u_user1", name: "Guest User", role: "user" };
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'backtoyou_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: "u_user1", name: "Guest User", role: "user" };
    next();
  }
};
