// items/providers/createItem.provider.js
const Item = require("../items.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const { uploadToCloudinary } = require("../../services/cloudinary.service.js");

async function createItemProvider(req, res) {
  const validData = matchedData(req);

  try {
    const { lat, lng, keywords, imageURL: _ignored, ...rest } = validData;

    // Upload image to Cloudinary if one was provided
    let imageURL = null;
    let imagePublicId = null;

    if (req.file?.buffer) {
      const uploaded = await uploadToCloudinary(req.file.buffer, {
        folder: "campus-lost-found/items",
      });
      imageURL = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    // Build the item payload
    const payload = {
      ...rest,
      postedBy: req.user.sub,

      // keywords comes in as a comma-separated string from FormData;
      // the validator's customSanitizer may already convert it to an array
      keywords: Array.isArray(keywords)
        ? keywords
        : keywords
        ? String(keywords).split(",").map((k) => k.trim()).filter(Boolean)
        : [],

      // Map flat lat/lng → nested coordinates (only if both are present)
      ...(lat && lng && {
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      }),

      // Cloudinary image fields
      imageURL,
      imagePublicId,
    };

    const item = new Item(payload);
    await item.save();

    logger.info("Item created successfully", {
      userId: req.user.sub,
      itemId: item._id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    errorLogger("Error while creating item: ", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      reason: "Unable to process your request at the moment, please try later.",
    });
  }
}

module.exports = createItemProvider;