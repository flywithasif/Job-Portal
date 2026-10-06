const express = require("express");

const {
  createInterview,
  getMyInterviews,
  getRecruiterInterviews,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// ALL INTERVIEW ROUTES REQUIRE LOGIN
// ============================================

router.use(protect);

// ============================================
// JOB SEEKER
// ============================================

// Get logged-in seeker's interviews
router.get(
  "/my",
  authorize("JOB_SEEKER"),
  getMyInterviews,
);

// ============================================
// RECRUITER / ADMIN
// ============================================

// Get recruiter interviews
router.get(
  "/recruiter",
  authorize(
    "RECRUITER",
    "ADMIN",
    "SUPER_ADMIN",
  ),
  getRecruiterInterviews,
);

// Schedule interview
router.post(
  "/",
  authorize(
    "RECRUITER",
    "ADMIN",
    "SUPER_ADMIN",
  ),
  createInterview,
);

// Update interview
router.patch(
  "/:id",
  authorize(
    "RECRUITER",
    "ADMIN",
    "SUPER_ADMIN",
  ),
  updateInterview,
);

// Cancel interview
router.delete(
  "/:id",
  authorize(
    "RECRUITER",
    "ADMIN",
    "SUPER_ADMIN",
  ),
  deleteInterview,
);

module.exports = router;