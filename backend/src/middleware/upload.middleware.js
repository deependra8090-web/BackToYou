// middleware/upload.middleware.js
const multer = require("multer");

// Use memory storage so the file buffer is available for Cloudinary upload.
// No local disk writes — files never touch the server filesystem.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png, .webp images are accepted"));
    }
  },
});

module.exports = upload;