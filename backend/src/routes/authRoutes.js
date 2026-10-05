const express = require("express");

const {
  register,
  login,
  getMe,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  registerValidation,
  loginValidation,
} = require("../middleware/authValidation");

const validate = require("../middleware/validate");

const authRateLimiter = require("../middleware/authRateLimiter");

const router = express.Router();

// ============================================
// PUBLIC AUTH ROUTES
// ============================================

// Register
router.post(
  "/register",
  authRateLimiter,
  registerValidation,
  validate,
  register
);

// Login
router.post(
  "/login",
  authRateLimiter,
  loginValidation,
  validate,
  login
);

// ============================================
// PROTECTED AUTH ROUTES
// ============================================

router.get(
  "/me",
  protect,
  getMe
);

module.exports = router;