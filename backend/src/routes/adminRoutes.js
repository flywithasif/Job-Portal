const express = require("express");

const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getAdminJobs,
  updateJobStatus,
  getAdminApplications,
} = require("../controllers/adminController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// All admin routes require authentication.
router.use(protect);

// ADMIN + SUPER_ADMIN can access dashboard.
router.get(
  "/dashboard",
  authorize("ADMIN", "SUPER_ADMIN"),
  getDashboardStats
);

// User management.
router.get(
  "/users",
  authorize("ADMIN", "SUPER_ADMIN"),
  getUsers
);

router.patch(
  "/users/:id/status",
  authorize("ADMIN", "SUPER_ADMIN"),
  updateUserStatus
);

router.patch(
  "/users/:id/role",
  authorize("ADMIN", "SUPER_ADMIN"),
  updateUserRole
);

// Job moderation.
router.get(
  "/jobs",
  authorize("ADMIN", "SUPER_ADMIN"),
  getAdminJobs
);

router.patch(
  "/jobs/:id/status",
  authorize("ADMIN", "SUPER_ADMIN"),
  updateJobStatus
);

// Application overview.
router.get(
  "/applications",
  authorize("ADMIN", "SUPER_ADMIN"),
  getAdminApplications
);

module.exports = router;
