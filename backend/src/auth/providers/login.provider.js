const{matchedData} = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const errorLogger = require("../../helpers/errorLogger.helper.js");
const getUserByEmail = require("../../users/providers/getUserByEmail.provider.js");
const bcrypt = require("bcrypt");
const generateTokenProvider = require("./generateToken.provider.js");

async function loginProvider(req, res) {

   const validatedData = matchedData(req);
 try {
     // Get the user from the database (throws if not found)
    const user = await getUserByEmail(validatedData.email);

    // Check if user is blocked
    if (user.isBlocked) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Your account has been suspended. Please contact support." });
    }

    // Compare password to hash
    const result = await bcrypt.compare(validatedData.password, user.password);

    if (!result) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Please check your credentials." });
    }

        // Generate Access token
    const token = generateTokenProvider(user);

    return res.status(StatusCodes.OK).json({
      accessToken: token,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    // User not found → return 401 (don't reveal which credential is wrong)
    if (error.statusCode === 404) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Please check your credentials." });
    }

    errorLogger("Error while trying to login: ", req, error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      reason: "Unable to process your request at the moment, please try later.",
    });
  }
}
module.exports = loginProvider;
