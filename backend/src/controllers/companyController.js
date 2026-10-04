const mongoose = require("mongoose");
const Company = require("../models/Company");
const Job = require("../models/Job");

const isAdmin = (user) =>
  ["ADMIN", "SUPER_ADMIN"].includes(user.role);

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/companies
// Public: list and search companies with pagination.
const getCompanies = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const filter = {};

    if (req.query.search?.trim()) {
      const search = escapeRegex(req.query.search.trim());

      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { industry: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Company.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: companies.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/companies/:id
// Public: get company details.
const getCompanyById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findById(req.params.id)
      .populate("createdBy", "name");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/companies/:id/jobs
// Public: list open jobs matching this company's name.
const getCompanyJobs = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findById(req.params.id).select("name");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const filter = {
      companyName: company.name,
      status: "OPEN",
    };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Job.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: jobs.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/companies
// Recruiter/admin: create a company profile.
const createCompany = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    const payload = {
      name: name.trim(),
      createdBy: req.user._id,
    };

    const fields = [
      "description",
      "website",
      "industry",
      "companySize",
      "location",
      "logo",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    }

    const company = await Company.create(payload);

    return res.status(201).json({
      success: true,
      message: "Company created successfully.",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/companies/:id
// Owner/admin: update company profile.
const updateCompany = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const owner =
      company.createdBy.toString() === req.user._id.toString();

    if (!owner && !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "You can only update companies you manage.",
      });
    }

    const fields = [
      "name",
      "description",
      "website",
      "industry",
      "companySize",
      "location",
      "logo",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company updated successfully.",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/companies/:id
// Owner/admin: delete only if no jobs reference this company name.
const deleteCompany = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const owner =
      company.createdBy.toString() === req.user._id.toString();

    if (!owner && !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "You can only delete companies you manage.",
      });
    }

    const linkedJobs = await Job.exists({
      companyName: company.name,
    });

    if (linkedJobs) {
      return res.status(409).json({
        success: false,
        message:
          "This company has jobs associated with its name. Close or reassign those jobs before deleting the company.",
      });
    }

    await company.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
  getCompanyJobs,
  createCompany,
  updateCompany,
  deleteCompany,
};
