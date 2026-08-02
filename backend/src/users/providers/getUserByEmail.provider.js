const User = require("../users.schema.js");

async function getUserByEmail(email) {
  // Let DB errors propagate so the caller can handle them properly
  const user = await User.findOne({ email: email });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
}

module.exports = getUserByEmail;