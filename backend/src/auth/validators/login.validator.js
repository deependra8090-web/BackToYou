const { body } = require("express-validator");

const loginValidator = [
  body("email", "Must be a valid email").isEmail().notEmpty().trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

module.exports = loginValidator;