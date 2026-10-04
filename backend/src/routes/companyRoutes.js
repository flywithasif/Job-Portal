const express = require("express");

const {
  getCompanies,
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

// Public routes
router.get("/", getCompanies);
router.get("/:id/jobs", getCompanyJobs);
router.get("/:id", getCompanyById);

// Protected routes
router.post(
  "/",
  protect,
  authorize(...recruitersAndAdmins),
  createCompany
);

router.put(
  "/:id",
  protect,
  authorize(...recruitersAndAdmins),
  updateCompany
);

router.delete(
  "/:id",
  protect,
  authorize(...recruitersAndAdmins),
  deleteCompany
);

module.exports = router;
