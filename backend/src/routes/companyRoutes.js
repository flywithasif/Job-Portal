const express = require("express");

const {
  getCompanies,
  getMyCompany,
  getCompanyById,
  getCompanyJobs,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

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

// ============================================
// PUBLIC ROUTES
// ============================================

router.get("/", getCompanies);

// IMPORTANT:
// /my must come BEFORE /:id
router.get(
  "/my",
  protect,
  authorize(...recruitersAndAdmins),
  getMyCompany,
);

router.get("/:id/jobs", getCompanyJobs);

router.get("/:id", getCompanyById);

// ============================================
// PROTECTED ROUTES
// ============================================

router.post(
  "/",
  protect,
  authorize(...recruitersAndAdmins),
  createCompany,
);

router.put(
  "/:id",
  protect,
  authorize(...recruitersAndAdmins),
  updateCompany,
);

router.delete(
  "/:id",
  protect,
  authorize(...recruitersAndAdmins),
  deleteCompany,
);

module.exports = router;