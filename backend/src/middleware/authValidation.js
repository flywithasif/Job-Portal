const { body } = require("express-validator");

// ============================================
// REGISTER VALIDATION
// ============================================

const registerValidation = [
  // --------------------------------------------
  // NAME
  // --------------------------------------------

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage(
      "Name must be between 2 and 100 characters."
    ),

  // --------------------------------------------
  // EMAIL
  // --------------------------------------------

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage(
      "Please provide a valid email address."
    )
    .normalizeEmail(),

  // --------------------------------------------
  // PASSWORD
  // --------------------------------------------

  body("password")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({
      min: 8,
      max: 128,
    })
    .withMessage(
      "Password must be between 8 and 128 characters."
    ),

  // --------------------------------------------
  // PHONE
  // --------------------------------------------

  body("phone")
    .optional({
      values: "falsy",
    })
    .isString()
    .withMessage("Phone number must be a string.")
    .trim()
    .isLength({
      max: 20,
    })
    .withMessage(
      "Phone number cannot exceed 20 characters."
    ),
];

// ============================================
// LOGIN VALIDATION
// ============================================

const loginValidation = [
  // --------------------------------------------
  // EMAIL
  // --------------------------------------------

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage(
      "Please provide a valid email address."
    )
    .normalizeEmail(),

  // --------------------------------------------
  // PASSWORD
  // --------------------------------------------

  body("password")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({
      max: 128,
    })
    .withMessage("Password is too long."),
];

// ============================================
// EXPORT
// ============================================

module.exports = {
  registerValidation,
  loginValidation,
};