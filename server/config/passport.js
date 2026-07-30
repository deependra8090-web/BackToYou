module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID || "demo_client_id",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo_client_secret",
  callbackURL: "/api/auth/google/callback"
};
