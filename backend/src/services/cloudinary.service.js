// services/cloudinary.service.js
const cloudinary = require("cloudinary").v2;

function ensureCloudinaryConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

ensureCloudinaryConfig();

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param {Buffer} buffer     - The file buffer from multer memoryStorage
 * @param {object} options    - Additional cloudinary upload options
 * @param {string} [options.folder="campus-lost-found"]
 * @param {string} [options.resource_type="image"]
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
function uploadToCloudinary(buffer, options = {}) {
  ensureCloudinaryConfig();
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: "campus-lost-found",
      resource_type: "image",
      ...options,
    };

    // Use upload_stream to pipe a buffer directly to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(buffer);
  });
}

/**
 * Delete an asset from Cloudinary by its public_id.
 *
 * @param {string} publicId - The Cloudinary public_id of the asset
 * @returns {Promise<object>} Cloudinary deletion result
 */
async function deleteFromCloudinary(publicId) {
  if (!publicId) return null;
  ensureCloudinaryConfig();
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
