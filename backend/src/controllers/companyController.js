const mongoose = require("mongoose");
const Company = require("../models/Company");
const Job = require("../models/Job");

const isAdmin = (user) =>
  ["ADMIN", "SUPER_ADMIN"].includes(user.role);

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const isValidHttpUrl = (value) => {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

const validateCompanyPayload = (body) => {
  const errors = [];

  if (body.name !== undefined) {
    if (typeof body.name !== "string") {
      errors.push("Company name must be a string.");
    } else {
      const name = body.name.trim();

      if (name.length < 2) {
        errors.push(
          "Company name must be at least 2 characters."
        );
      }

      if (name.length > 150) {
        errors.push(
          "Company name cannot exceed 150 characters."
        );
      }
    }
  }

  if (body.description !== undefined) {
    if (
      typeof body.description !== "string" ||
      body.description.length > 5000
    ) {
      errors.push(
        "Description must be a string and cannot exceed 5000 characters."
      );
    }
  }

  if (body.website !== undefined) {
    if (
      typeof body.website !== "string" ||
      body.website.length > 2048 ||
      !isValidHttpUrl(body.website.trim())
    ) {
      errors.push(
        "Website must be a valid HTTP or HTTPS URL."
      );
    }
  }

  if (body.logo !== undefined) {
    if (
      typeof body.logo !== "string" ||
      body.logo.length > 2048 ||
      !isValidHttpUrl(body.logo.trim())
    ) {
      errors.push(
        "Logo must be a valid HTTP or HTTPS URL."
      );
    }
  }

  if (body.industry !== undefined) {
    if (
      typeof body.industry !== "string" ||
      body.industry.trim().length > 100
    ) {
      errors.push(
        "Industry cannot exceed 100 characters."
      );
    }
  }

  if (body.location !== undefined) {
    if (
      typeof body.location !== "string" ||
      body.location.trim().length > 200
    ) {
      errors.push(
        "Location cannot exceed 200 characters."
      );
    }
  }

  if (body.foundedYear !== undefined && body.foundedYear !== null) {
    const year = Number(body.foundedYear);
    const currentYear = new Date().getFullYear();

    if (
      !Number.isInteger(year) ||
      year < 1800 ||
      year > currentYear
    ) {
      errors.push(
        `Founded year must be between 1800 and ${currentYear}.`
      );
    }
  }

  return errors;
};

// GET /api/companies
// Public: list and search companies with pagination.
const getCompanies = async (req, res, next) => {
  try {
    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        parseInt(req.query.limit, 10) || 10
      )
    );

    const filter = {};

    if (req.query.search?.trim()) {
      const search = escapeRegex(
        req.query.search.trim()
      );

      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          industry: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
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
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findById(id)
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
// Public: list open jobs belonging to this company.
const getCompanyJobs = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const companyExists = await Company.exists({
      _id: id,
    });

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        parseInt(req.query.limit, 10) || 10
      )
    );

    const filter = {
      company: id,
      status: "OPEN",
    };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate(
          "company",
          "name logo industry location companySize"
        )
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
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body must be an object.",
      });
    }

    const errors = validateCompanyPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Company validation failed.",
        errors,
      });
    }

    const {
      name,
      description,
      website,
      industry,
      companySize,
      location,
      logo,
      foundedYear,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    const payload = {
      name: name.trim(),
      createdBy: req.user._id,
    };

    if (description !== undefined) {
      payload.description =
        typeof description === "string"
          ? description.trim()
          : description;
    }

    if (website !== undefined) {
      payload.website =
        typeof website === "string"
          ? website.trim()
          : website;
    }

    if (industry !== undefined) {
      payload.industry =
        typeof industry === "string"
          ? industry.trim()
          : industry;
    }

    if (companySize !== undefined) {
      payload.companySize = companySize;
    }

    if (location !== undefined) {
      payload.location =
        typeof location === "string"
          ? location.trim()
          : location;
    }

    if (logo !== undefined) {
      payload.logo =
        typeof logo === "string"
          ? logo.trim()
          : logo;
    }

    if (foundedYear !== undefined) {
      payload.foundedYear =
        foundedYear === null || foundedYear === ""
          ? null
          : Number(foundedYear);
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
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        message: "Request body must be an object.",
      });
    }

    const errors = validateCompanyPayload(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Company validation failed.",
        errors,
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const owner =
      company.createdBy.toString() ===
      req.user._id.toString();

    if (!owner && !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update companies you manage.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "website",
      "industry",
      "companySize",
      "location",
      "logo",
      "foundedYear",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        let value = req.body[field];

        if (
          typeof value === "string" &&
          [
            "name",
            "description",
            "website",
            "industry",
            "location",
            "logo",
          ].includes(field)
        ) {
          value = value.trim();
        }

        if (
          field === "foundedYear" &&
          value !== null &&
          value !== ""
        ) {
          value = Number(value);
        }

        if (
          field === "foundedYear" &&
          value === ""
        ) {
          value = null;
        }

        company[field] = value;
      }
    }

    await company.save();

    // Keep Job.companyName snapshot synchronized
    // when the company name changes.
    if (req.body.name !== undefined) {
      await Job.updateMany(
        { company: company._id },
        {
          $set: {
            companyName: company.name,
          },
        }
      );
    }

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
// Owner/admin: delete only if no jobs reference this company.
const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    const owner =
      company.createdBy.toString() ===
      req.user._id.toString();

    if (!owner && !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete companies you manage.",
      });
    }

    const linkedJobs = await Job.exists({
      company: company._id,
    });

    if (linkedJobs) {
      return res.status(409).json({
        success: false,
        message:
          "This company has jobs associated with it. Close or reassign those jobs before deleting the company.",
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