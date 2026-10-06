const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Interview",
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    duration: {
      type: Number,
      min: 15,
      max: 480,
      default: 30,
    },

    type: {
      type: String,
      enum: [
        "VIDEO",
        "PHONE",
        "IN_PERSON",
      ],
      default: "VIDEO",
    },

    meetingLink: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    interviewerName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },

    interviewerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "SCHEDULED",
      index: true,
    },

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// COMPOUND INDEXES
// ============================================

interviewSchema.index({
  applicant: 1,
  scheduledAt: 1,
});

interviewSchema.index({
  recruiter: 1,
  scheduledAt: 1,
});

// Prevent duplicate interview at the same
// date/time for the same application.
interviewSchema.index(
  {
    application: 1,
    scheduledAt: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Interview",
  interviewSchema
);