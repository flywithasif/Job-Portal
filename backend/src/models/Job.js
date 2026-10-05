const mongoose = require("mongoose");

// ============================================
// JOB SCHEMA
// ============================================

const jobSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC JOB INFORMATION
    // ==========================================

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [2, "Job title must be at least 2 characters"],
      maxlength: [150, "Job title cannot exceed 150 characters"],
    },

    // ==========================================
    // COMPANY RELATION
    // ==========================================

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },

    // ==========================================
    // COMPANY NAME SNAPSHOT
    // ==========================================

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    // ==========================================
    // LOCATION
    // ==========================================

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
      maxlength: [150, "Job location cannot exceed 150 characters"],
    },

    // ==========================================
    // WORKPLACE TYPE
    // ==========================================

    workplaceType: {
      type: String,
      enum: {
        values: ["ONSITE", "REMOTE", "HYBRID"],
        message: "Invalid workplace type",
      },
      default: "ONSITE",
      index: true,
    },

    // ==========================================
    // EMPLOYMENT TYPE
    // ==========================================

    employmentType: {
      type: String,
      enum: {
        values: [
          "FULL_TIME",
          "PART_TIME",
          "CONTRACT",
          "INTERNSHIP",
          "FREELANCE",
        ],
        message: "Invalid employment type",
      },
      default: "FULL_TIME",
      index: true,
    },

    // ==========================================
    // EXPERIENCE LEVEL
    // ==========================================

    experienceLevel: {
      type: String,
      enum: {
        values: [
          "FRESHER",
          "ENTRY_LEVEL",
          "MID_LEVEL",
          "SENIOR",
        ],
        message: "Invalid experience level",
      },
      default: "ENTRY_LEVEL",
      index: true,
    },

    // ==========================================
    // DESCRIPTION
    // ==========================================

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [20, "Job description must be at least 20 characters"],
      maxlength: [
        10000,
        "Job description cannot exceed 10000 characters",
      ],
    },

    // ==========================================
    // REQUIREMENTS
    // ==========================================

    requirements: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [2, "Requirement must be at least 2 characters"],
          maxlength: [
            500,
            "Requirement cannot exceed 500 characters",
          ],
        },
      ],

      validate: [
        {
          validator: (requirements) => requirements.length <= 30,
          message: "A maximum of 30 requirements are allowed.",
        },
        {
          validator: (requirements) =>
            requirements.every(
              (requirement) =>
                typeof requirement === "string" &&
                requirement.trim().length > 0
            ),
          message: "Requirements cannot contain empty values.",
        },
      ],

      default: [],
    },

    // ==========================================
    // SKILLS
    // ==========================================

    skills: {
      type: [
        {
          type: String,
          trim: true,
          minlength: [1, "Skill cannot be empty"],
          maxlength: [80, "Skill cannot exceed 80 characters"],
        },
      ],

      validate: [
        {
          validator: (skills) => skills.length <= 50,
          message: "A maximum of 50 skills are allowed.",
        },
        {
          validator: (skills) =>
            skills.every(
              (skill) =>
                typeof skill === "string" && skill.trim().length > 0
            ),
          message: "Skills cannot contain empty values.",
        },
      ],

      default: [],
    },

    // ==========================================
    // SALARY
    // ==========================================

    salaryMin: {
      type: Number,
      min: [0, "Minimum salary cannot be negative"],
      default: null,
    },

    salaryMax: {
      type: Number,
      min: [0, "Maximum salary cannot be negative"],
      default: null,
    },

    // ==========================================
    // APPLICATION DEADLINE
    // ==========================================

    applicationDeadline: {
      type: Date,
      default: null,
      index: true,
    },

    // ==========================================
    // JOB STATUS
    // ==========================================

    status: {
      type: String,
      enum: {
        values: ["OPEN", "CLOSED"],
        message: "Invalid job status",
      },
      default: "OPEN",
      index: true,
    },

    // ==========================================
    // JOB CREATOR
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Job creator is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// INDEXES
// ============================================

jobSchema.index({
  createdAt: -1,
});

jobSchema.index({
  status: 1,
  createdAt: -1,
});

jobSchema.index({
  company: 1,
  status: 1,
});

jobSchema.index({
  createdBy: 1,
  createdAt: -1,
});

jobSchema.index({
  applicationDeadline: 1,
  status: 1,
});

jobSchema.index({
  title: "text",
  companyName: "text",
  description: "text",
});

// ============================================
// EXPORT
// ============================================

module.exports = mongoose.model("Job", jobSchema);