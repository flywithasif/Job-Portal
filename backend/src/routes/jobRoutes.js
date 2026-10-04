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

const recruitersAndAdmins = [
  "RECRUITER",
  "ADMIN",
  "SUPER_ADMIN",
];

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes
router.use(protect);

router.get(
  "/my",
  authorize(...recruitersAndAdmins),
  getMyJobs
);

router.post(
  "/",
  authorize(...recruitersAndAdmins),
  createJob
);

router.put(
  "/:id",
  authorize(...recruitersAndAdmins),
  updateJob
);

router.delete(
  "/:id",
  authorize(...recruitersAndAdmins),
  deleteJob
);

module.exports = router;
