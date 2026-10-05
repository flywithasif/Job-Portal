const mongoose = require("mongoose");

const Job = require("../models/Job");
const Company = require("../models/Company");
const Application = require("../models/Application");

// ============================================
// CONSTANTS
// ============================================

const ADMIN_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
];

const JOB_CREATOR_ROLES = [
  "RECRUITER",
  "ADMIN",
  "SUPER_ADMIN",
];

const ALLOWED_JOB_FIELDS = [
  "title",
  "company",
  "location",
  "workplaceType",
  "employmentType",
  "experienceLevel",
  "description",
  "requirements",
  "skills",
  "salaryMin",
  "salaryMax",
  "applicationDeadline",
  "status",
];

// ============================================
// HELPERS
// ============================================

const isAdmin = (user) => {
  return ADMIN_ROLES.includes(user.role);
};

const isJobCreator = (user) => {
  return JOB_CREATOR_ROLES.includes(user.role);
};

const isOwner = (job, user) => {
  return (
    job.createdBy.toString() ===
    user._id.toString()
  );
};

const parsePagination = (req) => {
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

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const validateSalary = (salaryMin, salaryMax) => {
  if (
    salaryMin != null &&
    (!Number.isFinite(Number(salaryMin)) ||
      Number(salaryMin) < 0)
  ) {
    return "salaryMin must be a non-negative number.";
  }

  if (
    salaryMax != null &&
    (!Number.isFinite(Number(salaryMax)) ||
      Number(salaryMax) < 0)
  ) {
    return "salaryMax must be a non-negative number.";
  }

  if (
    salaryMin != null &&
    salaryMax != null &&
    Number(salaryMax) < Number(salaryMin)
  ) {
    return "salaryMax cannot be less than salaryMin.";
  }

  return null;
};

const validateDeadline = (deadline) => {
  if (deadline == null || deadline === "") {
    return null;
  }

  const parsedDate = new Date(deadline);

  if (Number.isNaN(parsedDate.getTime())) {
    return "applicationDeadline must be a valid date.";
  }

  return null;
};

// ============================================
// GET /api/jobs
// ============================================
//
// Public:
// List open jobs with search, filters and
// pagination.
//

const getJobs = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      skip,
    } = parsePagination(req);

    const filter = {
      status: "OPEN",
    };

    // ==========================================
    // SEARCH
    // ==========================================

    if (req.query.search?.trim()) {
      filter.$text = {
        $search: req.query.search.trim(),
      };
    }

    // ==========================================
    // LOCATION FILTER
    // ==========================================

    if (req.query.location?.trim()) {
      filter.location = {
        $regex: escapeRegex(
          req.query.location.trim()
        ),
        $options: "i",
      };
    }

    // ==========================================
    // COMPANY FILTER
    // ==========================================

    if (req.query.company) {
      if (
        !mongoose.isValidObjectId(
          req.query.company
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID.",
        });
      }

      filter.company = req.query.company;
    }

    // ==========================================
    // ENUM FILTERS
    // ==========================================

    const enumFilters = [
      [
        "employmentType",
        "employmentType",
        [
          "FULL_TIME",
          "PART_TIME",
          "CONTRACT",
          "INTERNSHIP",
          "FREELANCE",
        ],
      ],
      [
        "workplaceType",
        "workplaceType",
        [
          "ONSITE",
          "REMOTE",
          "HYBRID",
        ],
      ],
      [
        "experienceLevel",
        "experienceLevel",
        [
          "FRESHER",
          "ENTRY_LEVEL",
          "MID_LEVEL",
          "SENIOR",
        ],
      ],
    ];

    for (const [
      queryKey,
      fieldName,
      allowedValues,
    ] of enumFilters) {
      if (req.query[queryKey]) {
        const value =
          req.query[queryKey].toUpperCase();

        if (!allowedValues.includes(value)) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${queryKey} filter.`,
          });
        }

        filter[fieldName] = value;
      }
    }

    // ==========================================
    // SALARY FILTER
    // ==========================================

    if (req.query.salaryMin !== undefined) {
      const minimum = Number(
        req.query.salaryMin
      );

      if (
        !Number.isFinite(minimum) ||
        minimum < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "salaryMin must be a non-negative number.",
        });
      }

      filter.$or = [
        {
          salaryMax: {
            $gte: minimum,
          },
        },
        {
          salaryMax: null,
          salaryMin: {
            $gte: minimum,
          },
        },
      ];
    }

    // ==========================================
    // QUERY
    // ==========================================

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate(
          "company",
          "name logo industry location companySize website"
        )
        .populate(
          "createdBy",
          "name"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
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
        totalPages:
          Math.ceil(total / limit),
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET /api/jobs/:id
// ============================================
//
// Public:
// Get one open job.
//

const getJobById = async (req, res, next) => {
  try {
    if (
      !mongoose.isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      status: "OPEN",
    })
      .populate(
        "company",
        "name description website industry location logo companySize"
      )
      .populate(
        "createdBy",
        "name"
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "Job not found or no longer available.",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// POST /api/jobs
// ============================================
//
// Recruiter/Admin:
// Create a new job.
//

const createJob = async (req, res, next) => {
  try {
    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    const {
      title,
      company,
      location,
      description,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Job title is required.",
      });
    }

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company is required.",
      });
    }

    if (
      typeof location !== "string" ||
      !location.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Job location is required.",
      });
    }

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Job description is required.",
      });
    }

    // ==========================================
    // COMPANY ID VALIDATION
    // ==========================================

    if (
      !mongoose.isValidObjectId(company)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    // ==========================================
    // FIND COMPANY
    // ==========================================

    const companyDoc =
      await Company.findById(company);

    if (!companyDoc) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // ==========================================
    // COMPANY OWNERSHIP
    // ==========================================
    //
    // Recruiters can only create jobs for their
    // own company.
    //
    // Admins can create jobs for any company.
    //

    if (!isAdmin(req.user)) {
      if (
        companyDoc.createdBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only create jobs for your own company.",
        });
      }
    }

    // ==========================================
    // BUILD PAYLOAD
    // ==========================================

    const payload = {};

    for (const field of ALLOWED_JOB_FIELDS) {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    }

    // Never trust companyName from client.
    // Always use the real Company document.
    payload.company =
      companyDoc._id;

    payload.companyName =
      companyDoc.name;

    // Never trust createdBy from request body.
    payload.createdBy =
      req.user._id;

    // ==========================================
    // SALARY VALIDATION
    // ==========================================

    const salaryError =
      validateSalary(
        payload.salaryMin,
        payload.salaryMax
      );

    if (salaryError) {
      return res.status(400).json({
        success: false,
        message: salaryError,
      });
    }

    // ==========================================
    // DEADLINE VALIDATION
    // ==========================================

    const deadlineError =
      validateDeadline(
        payload.applicationDeadline
      );

    if (deadlineError) {
      return res.status(400).json({
        success: false,
        message: deadlineError,
      });
    }

    // ==========================================
    // CREATE JOB
    // ==========================================

    const job = await Job.create(
      payload
    );

    // ==========================================
    // RETURN POPULATED JOB
    // ==========================================

    const populatedJob =
      await Job.findById(job._id)
        .populate(
          "company",
          "name description website industry location logo companySize"
        )
        .populate(
          "createdBy",
          "name"
        );

    return res.status(201).json({
      success: true,
      message:
        "Job created successfully.",
      data: populatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET /api/jobs/my
// ============================================
//
// Recruiter/Admin:
// List jobs created by logged-in user.
//

const getMyJobs = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      skip,
    } = parsePagination(req);

    const filter = {
      createdBy: req.user._id,
    };

    // ==========================================
    // STATUS FILTER
    // ==========================================

    if (req.query.status) {
      const status =
        req.query.status.toUpperCase();

      if (
        !["OPEN", "CLOSED"].includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status filter.",
        });
      }

      filter.status = status;
    }

    // ==========================================
    // QUERY
    // ==========================================

    const [jobs, total] =
      await Promise.all([
        Job.find(filter)
          .populate(
            "company",
            "name logo industry location"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
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
        totalPages:
          Math.ceil(total / limit),
      },
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// PUT /api/jobs/:id
// ============================================
//
// Recruiter:
//   Own jobs only.
//
// Admin:
//   Any job.
//

const updateJob = async (
  req,
  res,
  next
) => {
  try {
    if (
      !mongoose.isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job =
      await Job.findById(
        req.params.id
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // ==========================================
    // AUTHORIZATION
    // ==========================================

    const owner =
      isOwner(job, req.user);

    if (
      !isAdmin(req.user) &&
      !owner
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update jobs you created.",
      });
    }

    // ==========================================
    // BUILD UPDATES
    // ==========================================

    const updates = {};

    for (const field of ALLOWED_JOB_FIELDS) {
      if (
        req.body[field] !== undefined
      ) {
        updates[field] =
          req.body[field];
      }
    }

    // ==========================================
    // COMPANY UPDATE
    // ==========================================

    if (
      updates.company !== undefined
    ) {
      if (
        !mongoose.isValidObjectId(
          updates.company
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid company ID.",
        });
      }

      const companyDoc =
        await Company.findById(
          updates.company
        );

      if (!companyDoc) {
        return res.status(404).json({
          success: false,
          message:
            "Company not found.",
        });
      }

      // Recruiters can only move their job
      // to their own company.
      if (!isAdmin(req.user)) {
        if (
          companyDoc.createdBy.toString() !==
          req.user._id.toString()
        ) {
          return res.status(403).json({
            success: false,
            message:
              "You can only assign jobs to your own company.",
          });
        }
      }

      updates.company =
        companyDoc._id;

      updates.companyName =
        companyDoc.name;
    }

    // ==========================================
    // PREVENT CLIENT FROM CHANGING SNAPSHOT
    // ==========================================

    if (
      updates.company === undefined
    ) {
      delete updates.companyName;
    }

    // ==========================================
    // SALARY VALIDATION
    // ==========================================

    const salaryMin =
      updates.salaryMin !== undefined
        ? updates.salaryMin
        : job.salaryMin;

    const salaryMax =
      updates.salaryMax !== undefined
        ? updates.salaryMax
        : job.salaryMax;

    const salaryError =
      validateSalary(
        salaryMin,
        salaryMax
      );

    if (salaryError) {
      return res.status(400).json({
        success: false,
        message: salaryError,
      });
    }

    // ==========================================
    // DEADLINE VALIDATION
    // ==========================================

    if (
      updates.applicationDeadline !==
      undefined
    ) {
      const deadlineError =
        validateDeadline(
          updates.applicationDeadline
        );

      if (deadlineError) {
        return res.status(400).json({
          success: false,
          message: deadlineError,
        });
      }
    }

    // ==========================================
    // APPLY UPDATE
    // ==========================================

    Object.assign(
      job,
      updates
    );

    await job.save();

    // ==========================================
    // RETURN POPULATED JOB
    // ==========================================

    const updatedJob =
      await Job.findById(job._id)
        .populate(
          "company",
          "name description website industry location logo companySize"
        )
        .populate(
          "createdBy",
          "name"
        );

    return res.status(200).json({
      success: true,
      message:
        "Job updated successfully.",
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE /api/jobs/:id
// ============================================
//
// A job with applications cannot be deleted.
// Close it instead.
//
// This prevents dangling application records.
//

const deleteJob = async (
  req,
  res,
  next
) => {
  try {
    if (
      !mongoose.isValidObjectId(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job =
      await Job.findById(
        req.params.id
      );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // ==========================================
    // AUTHORIZATION
    // ==========================================

    const owner =
      isOwner(job, req.user);

    if (
      !isAdmin(req.user) &&
      !owner
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only delete jobs you created.",
      });
    }

    // ==========================================
    // CHECK APPLICATIONS
    // ==========================================

    const applicationCount =
      await Application.countDocuments({
        job: job._id,
      });

    if (applicationCount > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This job has applications and cannot be deleted. Close the job instead.",
        applicationCount,
      });
    }

    // ==========================================
    // DELETE
    // ==========================================

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Job deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
};