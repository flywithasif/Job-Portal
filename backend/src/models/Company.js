const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    logo: {
      type: String,
      trim: true,
      default: "",
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

    companySize: {
      type: String,
      enum: [
        "",
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
      default: null,
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

companySchema.index({ name: 1 });

module.exports = mongoose.model("Company", companySchema);
