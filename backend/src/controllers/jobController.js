const mongoose = require("mongoose");
const Job = require("../models/Job");

// Allowed job fields that clients can create or update.
const allowedFields = [
  "title",
  "companyName",
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

// GET /api/jobs
// Public: list jobs with search, filters and pagination.
const getJobs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const filter = { status: "OPEN" };

    if (req.query.search?.trim()) {
      filter.$text = { $search: req.query.search.trim() };
    }

    if (req.query.location?.trim()) {
      filter.location = {
        $regex: req.query.location.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    const enumFilters = [
      ["employmentType", "employmentType"],
      ["workplaceType", "workplaceType"],
      ["experienceLevel", "experienceLevel"],
    ];

    for (const [queryKey, fieldName] of enumFilters) {
      if (req.query[queryKey]) {
        filter[fieldName] = req.query[queryKey].toUpperCase();
      }
    }

    if (req.query.salaryMin !== undefined) {
      const minimum = Number(req.query.salaryMin);

      if (!Number.isFinite(minimum) || minimum < 0) {
        return res.status(400).json({
          success: false,
          message: "salaryMin must be a non-negative number.",
        });
      }

      filter.$or = [
        { salaryMax: { $gte: minimum } },
        { salaryMax: null, salaryMin: { $gte: minimum } },
      ];
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("createdBy", "name")
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

// GET /api/jobs/:id
// Public: get one open job.
const getJobById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      status: "OPEN",
    }).populate("createdBy", "name");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer available.",
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

// POST /api/jobs
// Recruiter/admin: create a job.
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      location,
      description,
    } = req.body;

    if (
      !title?.trim() ||
      !companyName?.trim() ||
      !location?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, companyName, location and description are required.",
      });
    }

    const payload = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        payload[field] = req.body[field];
      }
    }

    if (
      payload.salaryMin != null &&
      (!Number.isFinite(Number(payload.salaryMin)) ||
        Number(payload.salaryMin) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "salaryMin must be a non-negative number.",
      });
    }

    if (
      payload.salaryMax != null &&
      (!Number.isFinite(Number(payload.salaryMax)) ||
        Number(payload.salaryMax) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "salaryMax must be a non-negative number.",
      });
    }

    if (
      payload.salaryMin != null &&
      payload.salaryMax != null &&
      Number(payload.salaryMax) < Number(payload.salaryMin)
    ) {
      return res.status(400).json({
        success: false,
        message: "salaryMax cannot be less than salaryMin.",
      });
    }

    // Never accept createdBy from the request body.
    payload.createdBy = req.user._id;

    const job = await Job.create(payload);

    return res.status(201).json({
      success: true,
      message: "Job created successfully.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/my
// Recruiter/admin: list jobs created by the logged-in user.
const getMyJobs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const filter = { createdBy: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status.toUpperCase();
    }

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

// PUT /api/jobs/:id
// Recruiter can update their own jobs; admins can update any job.
const updateJob = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(req.user.role);
    const isOwner = job.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You can only update jobs you created.",
      });
    }

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const salaryMin =
      updates.salaryMin !== undefined ? updates.salaryMin : job.salaryMin;
    const salaryMax =
      updates.salaryMax !== undefined ? updates.salaryMax : job.salaryMax;

    if (
      salaryMin != null &&
      (!Number.isFinite(Number(salaryMin)) || Number(salaryMin) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "salaryMin must be a non-negative number.",
      });
    }

    if (
      salaryMax != null &&
      (!Number.isFinite(Number(salaryMax)) || Number(salaryMax) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "salaryMax must be a non-negative number.",
      });
    }

    if (
      salaryMin != null &&
      salaryMax != null &&
      Number(salaryMax) < Number(salaryMin)
    ) {
      return res.status(400).json({
        success: false,
        message: "salaryMax cannot be less than salaryMin.",
      });
    }

    Object.assign(job, updates);
    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jobs/:id
// Recruiter can delete their own jobs; admins can delete any job.
const deleteJob = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(req.user.role);
    const isOwner = job.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You can only delete jobs you created.",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
};
