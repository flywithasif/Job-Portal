const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();

const companySchema = new mongoose.Schema(
  {
    // Company name
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Company name must be at least 2 characters"],
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    // Company description
    description: {
      type: String,
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
      default: "",
    },

    // Company website
    website: {
      type: String,
      trim: true,
      maxlength: [2048, "Website URL cannot exceed 2048 characters"],
      default: "",
    },

    // Company logo URL
    logo: {
      type: String,
      trim: true,
      maxlength: [2048, "Logo URL cannot exceed 2048 characters"],
      default: "",
    },

    // Industry / business sector
    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry cannot exceed 100 characters"],
      default: "",
    },

    // Company employee size
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

    // Company location
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
      default: "",
    },

    // Year the company was founded
    foundedYear: {
      type: Number,
      min: [1800, "Founded year cannot be before 1800"],
      max: [currentYear, "Founded year cannot be in the future"],
      default: null,
    },

    // User who owns/created the company
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Company owner is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search companies by name
companySchema.index({
  name: 1,
});

// Useful for industry-based filtering
companySchema.index({
  industry: 1,
});

// Useful for location-based filtering
companySchema.index({
  location: 1,
});

// Useful for owner's company lookup
companySchema.index({
  createdBy: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Company", companySchema);