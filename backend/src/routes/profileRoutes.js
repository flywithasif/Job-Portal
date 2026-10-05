const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Every profile endpoint requires a valid login.
router.use(protect);

// Get the current user's profile.
router.get("/me", getMyProfile);

// Update the current user's profile.
router.patch("/me", updateMyProfile);

module.exports = router;
