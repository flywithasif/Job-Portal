const express = require("express");

const {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// ROLES
// ============================================

const recruitersAndAdmins = [
  "RECRUITER",
  "ADMIN",
  "SUPER_ADMIN",
];

// ============================================
// PUBLIC ROUTES
// ============================================

// List all open jobs
router.get(
  "/",
  getJobs
);

// ============================================
// PROTECTED "MY JOBS" ROUTE
// ============================================
//
// IMPORTANT:
// This MUST come before "/:id".
// Otherwise Express would treat "my" as a job ID.
//

router.get(
  "/my",
  protect,
  authorize(...recruitersAndAdmins),
  getMyJobs
);

// ============================================
// PUBLIC JOB DETAILS
// ============================================

// Get one open job
router.get(
  "/:id",
  getJobById
);

// ============================================
// PROTECTED JOB ROUTES
// ============================================

router.use(protect);

// ============================================
// CREATE JOB
// ============================================

router.post(
  "/",
  authorize(...recruitersAndAdmins),
  createJob
);

// ============================================
// UPDATE JOB
// ============================================

router.put(
  "/:id",
  authorize(...recruitersAndAdmins),
  updateJob
);

// ============================================
// DELETE JOB
// ============================================

router.delete(
  "/:id",
  authorize(...recruitersAndAdmins),
  deleteJob
);

module.exports = router;