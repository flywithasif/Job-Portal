const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Company = require("../models/Company");

const ALLOWED_ROLES = [
  "JOB_SEEKER",
  "RECRUITER",
  "ADMIN",
  "SUPER_ADMIN",
];

const ALLOWED_JOB_STATUSES = [
  "OPEN",
  "CLOSED",
];

const ALLOWED_APPLICATION_STATUSES = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

const ADMIN_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
];

const isAdmin = (user) =>
  ADMIN_ROLES.includes(user.role);

const isSuperAdmin = (user) =>
  user.role === "SUPER_ADMIN";

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

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ============================================
// GET DASHBOARD STATS
// GET /api/admin/dashboard
// ============================================

const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    const [
      totalUsers,
      totalJobSeekers,
      totalRecruiters,
      totalAdmins,
      totalJobs,
      openJobs,
      totalCompanies,
      totalApplications,
      pendingApplications,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "JOB_SEEKER",
      }),

      User.countDocuments({
        role: "RECRUITER",
      }),

      User.countDocuments({
        role: {
          $in: ADMIN_ROLES,
        },
      }),

      Job.countDocuments(),

      Job.countDocuments({
        status: "OPEN",
      }),

      Company.countDocuments(),

      Application.countDocuments(),

      Application.countDocuments({
        status: "PENDING",
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          jobSeekers: totalJobSeekers,
          recruiters: totalRecruiters,
          admins: totalAdmins,
        },

        jobs: {
          total: totalJobs,
          open: openJobs,
        },

        companies: {
          total: totalCompanies,
        },

        applications: {
          total: totalApplications,
          pending: pendingApplications,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET USERS
// GET /api/admin/users
// ============================================

const getUsers = async (
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

    const filter = {};

    // Search by name/email
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
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by role
    if (req.query.role) {
      const role =
        req.query.role
          .trim()
          .toUpperCase();

      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user role.",
        });
      }

      filter.role = role;
    }

    // Filter by active status
    if (
      req.query.isActive !== undefined
    ) {
      const isActive =
        req.query.isActive;

      if (
        !["true", "false"].includes(
          isActive
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "isActive must be true or false.",
        });
      }

      filter.isActive =
        isActive === "true";
    }

    const [
      users,
      total,
    ] = await Promise.all([
      User.find(filter)
        .select(
          "-password"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },

      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE USER STATUS
// PATCH /api/admin/users/:id/status
// ============================================

const updateUserStatus = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { isActive } =
      req.body || {};

    if (
      !mongoose.isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (
      typeof isActive !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be a boolean.",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Nobody can change their own status.
    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own account status.",
      });
    }

    // Only SUPER_ADMIN can modify
    // ADMIN or SUPER_ADMIN accounts.
    if (
      ADMIN_ROLES.includes(user.role) &&
      !isSuperAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only SUPER_ADMIN can modify an admin account.",
      });
    }

    user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      success: true,
      message: isActive
        ? "User activated successfully."
        : "User deactivated successfully.",

      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE USER ROLE
// PATCH /api/admin/users/:id/role
// ============================================

const updateUserRole = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { role } =
      req.body || {};

    if (
      !mongoose.isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    if (
      typeof role !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be a string.",
      });
    }

    const normalizedRole =
      role.trim().toUpperCase();

    if (
      !ALLOWED_ROLES.includes(
        normalizedRole
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role.",
      });
    }

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent self role modification.
    if (
      user._id.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot change your own role.",
      });
    }

    // Normal ADMIN cannot modify
    // any admin account.
    if (
      ADMIN_ROLES.includes(user.role) &&
      !isSuperAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only SUPER_ADMIN can modify an admin account.",
      });
    }

    // Only SUPER_ADMIN can assign
    // ADMIN or SUPER_ADMIN.
    if (
      ADMIN_ROLES.includes(
        normalizedRole
      ) &&
      !isSuperAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only SUPER_ADMIN can assign admin roles.",
      });
    }

    // SUPER_ADMIN should remain protected.
    if (
      user.role === "SUPER_ADMIN" &&
      normalizedRole !== "SUPER_ADMIN"
    ) {
      if (!isSuperAdmin(req.user)) {
        return res.status(403).json({
          success: false,
          message:
            "Only SUPER_ADMIN can modify a SUPER_ADMIN.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          "SUPER_ADMIN cannot be demoted through this endpoint.",
      });
    }

    user.role =
      normalizedRole;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "User role updated successfully.",

      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ADMIN JOBS
// GET /api/admin/jobs
// ============================================

const getAdminJobs = async (
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

    const filter = {};

    // Filter by job status
    if (req.query.status) {
      const status =
        req.query.status
          .trim()
          .toUpperCase();

      if (
        !ALLOWED_JOB_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid job status.",
        });
      }

      filter.status = status;
    }

    // Search by title/company
    if (req.query.search?.trim()) {
      const search = escapeRegex(
        req.query.search.trim()
      );

      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          companyName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [
      jobs,
      total,
    ] = await Promise.all([
      Job.find(filter)
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "company",
          "name logo industry location"
        )
        .sort({ createdAt: -1 })
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
        totalPages: Math.ceil(
          total / limit
        ),
      },

      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE JOB STATUS
// PATCH /api/admin/jobs/:id/status
// ============================================

const updateJobStatus = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { status } =
      req.body || {};

    if (
      !mongoose.isValidObjectId(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID.",
      });
    }

    if (
      typeof status !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be a string.",
      });
    }

    const normalizedStatus =
      status.trim().toUpperCase();

    if (
      !ALLOWED_JOB_STATUSES.includes(
        normalizedStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be OPEN or CLOSED.",
      });
    }

    const job =
      await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    job.status =
      normalizedStatus;

    await job.save();

    return res.status(200).json({
      success: true,
      message:
        "Job status updated successfully.",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ADMIN APPLICATIONS
// GET /api/admin/applications
// ============================================

const getAdminApplications = async (
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

    const filter = {};

    if (req.query.status) {
      const status =
        req.query.status
          .trim()
          .toUpperCase();

      if (
        !ALLOWED_APPLICATION_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid application status.",
        });
      }

      filter.status = status;
    }

    const [
      applications,
      total,
    ] = await Promise.all([
      Application.find(filter)
        .populate(
          "applicant",
          "name email role phone profilePhoto"
        )
        .populate(
          "job",
          "title companyName location status"
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

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserRole,
  getAdminJobs,
  updateJobStatus,
  getAdminApplications,
};