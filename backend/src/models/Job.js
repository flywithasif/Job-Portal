const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Job title cannot exceed 150 characters"],
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },

    workplaceType: {
      type: String,
      enum: ["ONSITE", "REMOTE", "HYBRID"],
      default: "ONSITE",
    },

    employmentType: {
      type: String,
      enum: [
        "FULL_TIME",
        "PART_TIME",
        "CONTRACT",
        "INTERNSHIP",
        "FREELANCE",
      ],
      default: "FULL_TIME",
    },

    experienceLevel: {
      type: String,
      enum: ["FRESHER", "ENTRY_LEVEL", "MID_LEVEL", "SENIOR"],
      default: "ENTRY_LEVEL",
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

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

    applicationDeadline: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ createdAt: -1 });
jobSchema.index({ title: "text", companyName: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);
