const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ============================================
    // JOB
    // ============================================

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
      index: true,
    },

    // ============================================
    // APPLICANT
    // ============================================

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant is required"],
      index: true,
    },

    // ============================================
    // RESUME URL
    // ============================================

    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required"],
      trim: true,
      maxlength: [
        2048,
        "Resume URL cannot exceed 2048 characters",
      ],
    },

    // ============================================
    // COVER LETTER
    // ============================================

    coverLetter: {
      type: String,
      trim: true,
      maxlength: [
        5000,
        "Cover letter cannot exceed 5000 characters",
      ],
      default: "",
    },

    // ============================================
    // APPLICATION STATUS
    // ============================================

    status: {
      type: String,
      enum: {
        values: [
          "PENDING",
          "REVIEWING",
          "SHORTLISTED",
          "REJECTED",
          "ACCEPTED",
        ],
        message: "Invalid application status",
      },
      default: "PENDING",
      index: true,
    },

    // ============================================
    // RECRUITER NOTES
    // ============================================

    recruiterNotes: {
      type: String,
      trim: true,
      maxlength: [
        3000,
        "Recruiter notes cannot exceed 3000 characters",
      ],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// PREVENT DUPLICATE APPLICATIONS
// ============================================

applicationSchema.index(
  {
    job: 1,
    applicant: 1,
  },
  {
    unique: true,
  }
);

// ============================================
// PERFORMANCE INDEXES
// ============================================

// Applicant's applications
applicationSchema.index({
  applicant: 1,
  createdAt: -1,
});

// Job applications filtered by status
applicationSchema.index({
  job: 1,
  status: 1,
  createdAt: -1,
});

// ============================================
// MODEL
// ============================================

module.exports = mongoose.model(
  "Application",
  applicationSchema
);