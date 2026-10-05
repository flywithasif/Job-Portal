const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");

const ALLOWED_STATUSES = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

const STATUS_TRANSITIONS = {
  PENDING: [
    "PENDING",
    "REVIEWING",
    "REJECTED",
  ],

  REVIEWING: [
    "REVIEWING",
    "SHORTLISTED",
    "REJECTED",
  ],

  SHORTLISTED: [
    "SHORTLISTED",
    "ACCEPTED",
    "REJECTED",
  ],

  REJECTED: [
    "REJECTED",
  ],

  ACCEPTED: [
    "ACCEPTED",
  ],
};

const MAX_RESUME_URL_LENGTH = 2048;
const MAX_COVER_LETTER_LENGTH = 5000;
const MAX_RECRUITER_NOTES_LENGTH = 3000;

const isAdmin = (user) =>
  ["ADMIN", "SUPER_ADMIN"].includes(user.role);

const getPagination = (query) => {
  const page = Math.max(
    1,
    parseInt(query.page, 10) || 1
  );

  const limit = Math.min(
    50,
    Math.max(
      1,
      parseInt(query.limit, 10) || 10
    )
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const isValidHttpUrl = (value) => {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return false;
  }

  if (value.length > MAX_RESUME_URL_LENGTH) {
    return false;
  }

  try {
    const url = new URL(value.trim());

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

// ============================================
// APPLY FOR JOB
// POST /api/applications
// ============================================

const applyForJob = async (req, res, next) => {
  try {
    if (
      !req.body ||
      typeof req.body !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Request body must be an object.",
      });
    }

    const {
      jobId,
      resumeUrl,
      coverLetter,
    } = req.body;

    // Validate job ID
    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        success: false,
        message:
          "A valid jobId is required.",
      });
    }

    // Validate resume URL
    if (
      !isValidHttpUrl(resumeUrl)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Resume URL must be a valid HTTP or HTTPS URL.",
      });
    }

    // Validate cover letter
    if (
      coverLetter !== undefined &&
      typeof coverLetter !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cover letter must be a string.",
      });
    }

    if (
      typeof coverLetter === "string" &&
      coverLetter.length >
        MAX_COVER_LETTER_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cover letter cannot exceed 5000 characters.",
      });
    }

    // Find only an open job
    const job = await Job.findOne({
      _id: jobId,
      status: "OPEN",
    }).select(
      "_id title companyName location applicationDeadline"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "Job not found or applications are closed.",
      });
    }

    // Check application deadline
    if (
      job.applicationDeadline &&
      job.applicationDeadline < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The application deadline has passed.",
      });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      resumeUrl: resumeUrl.trim(),
      coverLetter:
        typeof coverLetter === "string"
          ? coverLetter.trim()
          : "",
    });

    return res.status(201).json({
      success: true,
      message:
        "Application submitted successfully.",
      data: application,
    });
  } catch (error) {
    // Unique index:
    // one applicant can apply only once per job.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this job.",
      });
    }

    next(error);
  }
};

// ============================================
// GET MY APPLICATIONS
// GET /api/applications/my
// ============================================

const getMyApplications = async (
  req,
  res,
  next
) => {
  try {
    const {
      page,
      limit,
      skip,
    } = getPagination(req.query);

    const filter = {
      applicant: req.user._id,
    };

    const [
      applications,
      total,
    ] = await Promise.all([
      Application.find(filter)
        .select(
          "job applicant resumeUrl coverLetter status createdAt updatedAt"
        )
        .populate(
          "job",
          "title companyName location workplaceType employmentType experienceLevel status applicationDeadline createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Application.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: applications.length,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },

      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET JOB APPLICATIONS
// GET /api/applications/job/:jobId
// ============================================

const getJobApplications = async (
  req,
  res,
  next
) => {
  try {
    const { jobId } = req.params;

    if (
      !mongoose.isValidObjectId(jobId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findById(
      jobId
    ).select(
      "_id title companyName location createdBy"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const ownsJob =
      job.createdBy.toString() ===
      req.user._id.toString();

    if (
      !ownsJob &&
      !isAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You cannot view applications for this job.",
      });
    }

    const {
      page,
      limit,
      skip,
    } = getPagination(req.query);

    const filter = {
      job: job._id,
    };

    // Optional status filter
    if (req.query.status) {
      const status =
        req.query.status
          .trim()
          .toUpperCase();

      if (
        !ALLOWED_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application status filter.",
        });
      }

      filter.status = status;
    }

    const [
      applications,
      total,
    ] = await Promise.all([
      Application.find(filter)
        .select(
          "job applicant resumeUrl coverLetter status recruiterNotes createdAt updatedAt"
        )
        .populate(
          "applicant",
          "name email phone profilePhoto headline location skills resumeUrl linkedinUrl portfolioUrl"
        )
        .populate(
          "job",
          "title companyName location workplaceType employmentType experienceLevel status applicationDeadline"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Application.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: applications.length,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },

      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE APPLICATION STATUS
// PATCH /api/applications/:id/status
// ============================================

const updateApplicationStatus = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const {
      status,
      recruiterNotes,
    } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid application ID.",
      });
    }

    if (
      status === undefined &&
      recruiterNotes === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Provide status or recruiterNotes to update.",
      });
    }

    // Validate status
    let normalizedStatus;

    if (status !== undefined) {
      if (
        typeof status !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Application status must be a string.",
        });
      }

      normalizedStatus =
        status.trim().toUpperCase();

      if (
        !ALLOWED_STATUSES.includes(
          normalizedStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application status.",
        });
      }
    }

    // Validate recruiter notes
    if (
      recruiterNotes !== undefined &&
      typeof recruiterNotes !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "recruiterNotes must be a string.",
      });
    }

    if (
      typeof recruiterNotes === "string" &&
      recruiterNotes.length >
        MAX_RECRUITER_NOTES_LENGTH
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Recruiter notes cannot exceed 3000 characters.",
      });
    }

    const application =
      await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found.",
      });
    }

    const job = await Job.findById(
      application.job
    ).select(
      "_id createdBy status"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "Associated job not found.",
      });
    }

    const ownsJob =
      job.createdBy.toString() ===
      req.user._id.toString();

    if (
      !ownsJob &&
      !isAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You cannot manage this application.",
      });
    }

    // Prevent invalid status transitions.
    if (
      normalizedStatus !== undefined &&
      normalizedStatus !==
        application.status
    ) {
      const allowedNextStatuses =
        STATUS_TRANSITIONS[
          application.status
        ] || [];

      if (
        !allowedNextStatuses.includes(
          normalizedStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Application cannot move from ${application.status} to ${normalizedStatus}.`,
        });
      }
    }

    if (
      normalizedStatus !== undefined
    ) {
      application.status =
        normalizedStatus;
    }

    if (
      recruiterNotes !== undefined
    ) {
      application.recruiterNotes =
        recruiterNotes.trim();
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Application updated successfully.",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};