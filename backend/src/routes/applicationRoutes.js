const express = require("express");

const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All application endpoints require authentication.
router.use(protect);

// Job seeker endpoints
router.post(
  "/",
  authorize("JOB_SEEKER"),
  applyForJob
);

router.get(
  "/my",
  authorize("JOB_SEEKER"),
  getMyApplications
);

// Recruiter/admin endpoints
router.get(
  "/job/:jobId",
  authorize("RECRUITER", "ADMIN", "SUPER_ADMIN"),
  getJobApplications
);

router.patch(
  "/:id/status",
  authorize("RECRUITER", "ADMIN", "SUPER_ADMIN"),
  updateApplicationStatus
);

module.exports = router;
