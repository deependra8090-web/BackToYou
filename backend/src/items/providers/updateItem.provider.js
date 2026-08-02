// items/providers/updateItem.provider.js
const Item = require("../items.schema.js");
const { matchedData } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const logger = require("../../helpers/winston.helper.js");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../services/cloudinary.service.js");

async function updateItemProvider(req, res) {
  try {
    const validData = matchedData(req);
    const { lat, lng, keywords, ...rest } = validData;

    const item = await Item.findById(validData.id);

    if (!item) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Item not found",
      });
    }

    // Ownership check
    if (item.postedBy.toString() !== req.user.sub) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "You are not allowed to update this item",
      });
    }

    // Prevent updating resolved items
    if (item.status === "claimed" || item.status === "closed") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Cannot update a closed or claimed item",
      });
    }

    // Build update payload
    const updatePayload = { ...rest };

    // Keywords handling
    if (keywords) {
      updatePayload.keywords = Array.isArray(keywords)
        ? keywords
        : String(keywords).split(",").map((k) => k.trim()).filter(Boolean);
    }

    // Coordinates update
    if (lat !== undefined && lng !== undefined) {
      updatePayload.coordinates = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
    }

    // Image update — upload new image to Cloudinary and delete the old one
    if (req.file?.buffer) {
      // Delete old image from Cloudinary (fire-and-forget; don't block update)
      if (item.imagePublicId) {
        deleteFromCloudinary(item.imagePublicId).catch((err) =>
          logger.warn("Failed to delete old Cloudinary image", {
            publicId: item.imagePublicId,
            error: err.message,
          })
        );
      }

      const uploaded = await uploadToCloudinary(req.file.buffer, {
        folder: "campus-lost-found/items",
      });
      updatePayload.imageURL = uploaded.secure_url;
      updatePayload.imagePublicId = uploaded.public_id;
    }

    // NEVER allow status, ownership or verification changes from user
    delete updatePayload.status;
    delete updatePayload.postedBy;
    delete updatePayload.verifiedBy;

    const updatedItem = await Item.findByIdAndUpdate(
      validData.id,
      { $set: updatePayload },
      { new: true }
    );

    logger.info("Item updated", {
      userId: req.user.sub,
      itemId: validData.id,
    });

    return res.status(StatusCodes.OK).json({
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    errorLogger("Error updating item", req, error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update item",
    });
  }
}

module.exports = updateItemProvider;