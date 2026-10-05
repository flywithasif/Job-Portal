const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ============================================
// EDUCATION SUB-SCHEMA
// ============================================

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      trim: true,
      maxlength: [
        200,
        "Institution cannot exceed 200 characters.",
      ],
    },

    degree: {
      type: String,
      trim: true,
      maxlength: [
        150,
        "Degree cannot exceed 150 characters.",
      ],
    },

    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: [
        150,
        "Field of study cannot exceed 150 characters.",
      ],
    },

    startYear: {
      type: Number,
      min: [1950, "Start year is invalid."],
      max: [2100, "Start year is invalid."],
    },

    endYear: {
      type: Number,
      min: [1950, "End year is invalid."],
      max: [2100, "End year is invalid."],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        1000,
        "Education description cannot exceed 1000 characters.",
      ],
    },
  },
  {
    _id: false,
  }
);

// ============================================
// EXPERIENCE SUB-SCHEMA
// ============================================

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      trim: true,
      maxlength: [
        200,
        "Company cannot exceed 200 characters.",
      ],
    },

    position: {
      type: String,
      trim: true,
      maxlength: [
        150,
        "Position cannot exceed 150 characters.",
      ],
    },

    employmentType: {
      type: String,
      enum: {
        values: [
          "",
          "FULL_TIME",
          "PART_TIME",
          "CONTRACT",
          "INTERNSHIP",
          "FREELANCE",
        ],
        message: "Invalid employment type.",
      },
      default: "",
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        2000,
        "Experience description cannot exceed 2000 characters.",
      ],
    },
  },
  {
    _id: false,
  }
);

// ============================================
// EDUCATION VALIDATION
// ============================================

educationSchema.pre("validate", function (next) {
  if (
    this.startYear !== undefined &&
    this.startYear !== null &&
    this.endYear !== undefined &&
    this.endYear !== null &&
    this.endYear < this.startYear
  ) {
    return next(
      new Error(
        "Education end year cannot be before start year."
      )
    );
  }

  next();
});

// ============================================
// EXPERIENCE VALIDATION
// ============================================

experienceSchema.pre("validate", function (next) {
  if (
    this.startDate &&
    this.endDate &&
    this.endDate < this.startDate
  ) {
    return next(
      new Error(
        "Experience end date cannot be before start date."
      )
    );
  }

  // If the user is currently working,
  // endDate must remain null.
  if (this.currentlyWorking) {
    this.endDate = null;
  }

  next();
});

// ============================================
// USER SCHEMA
// ============================================

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      minlength: [
        2,
        "Name must be at least 2 characters.",
      ],
      maxlength: [
        100,
        "Name cannot exceed 100 characters.",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [
        254,
        "Email cannot exceed 254 characters.",
      ],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ],
      index: true,
    },

    // ==========================================
    // PASSWORD
    // ==========================================

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [
        8,
        "Password must be at least 8 characters.",
      ],
      maxlength: [
        128,
        "Password cannot exceed 128 characters.",
      ],
      select: false,
    },

    // ==========================================
    // CONTACT
    // ==========================================

    phone: {
      type: String,
      trim: true,
      maxlength: [
        20,
        "Phone number cannot exceed 20 characters.",
      ],
      default: "",
    },

    // ==========================================
    // ROLE
    // ==========================================

    role: {
      type: String,
      enum: {
        values: [
          "JOB_SEEKER",
          "RECRUITER",
          "ADMIN",
          "SUPER_ADMIN",
        ],
        message: "Invalid user role.",
      },
      default: "JOB_SEEKER",
      index: true,
    },

    // ==========================================
    // PROFILE PHOTO
    // ==========================================

    profilePhoto: {
      type: String,
      trim: true,
      maxlength: [
        2048,
        "Profile photo URL is too long.",
      ],
      default: "",
    },

    // ==========================================
    // PROFESSIONAL PROFILE
    // ==========================================

    headline: {
      type: String,
      trim: true,
      maxlength: [
        160,
        "Headline cannot exceed 160 characters.",
      ],
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: [
        150,
        "Location cannot exceed 150 characters.",
      ],
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [
        3000,
        "Bio cannot exceed 3000 characters.",
      ],
      default: "",
    },

    // ==========================================
    // SKILLS
    // ==========================================

    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [
            80,
            "Skill cannot exceed 80 characters.",
          ],
        },
      ],

      validate: {
        validator: (skills) =>
          Array.isArray(skills) &&
          skills.length <= 50,

        message:
          "You can add a maximum of 50 skills.",
      },

      default: [],
    },

    // ==========================================
    // RESUME
    // ==========================================

    resumeUrl: {
      type: String,
      trim: true,
      maxlength: [
        2048,
        "Resume URL is too long.",
      ],
      default: "",
    },

    // ==========================================
    // LINKEDIN
    // ==========================================

    linkedinUrl: {
      type: String,
      trim: true,
      maxlength: [
        2048,
        "LinkedIn URL is too long.",
      ],
      default: "",
    },

    // ==========================================
    // PORTFOLIO
    // ==========================================

    portfolioUrl: {
      type: String,
      trim: true,
      maxlength: [
        2048,
        "Portfolio URL is too long.",
      ],
      default: "",
    },

    // ==========================================
    // EDUCATION
    // ==========================================

    education: {
      type: [educationSchema],

      validate: {
        validator: (education) =>
          Array.isArray(education) &&
          education.length <= 20,

        message:
          "You can add a maximum of 20 education entries.",
      },

      default: [],
    },

    // ==========================================
    // EXPERIENCE
    // ==========================================

    experience: {
      type: [experienceSchema],

      validate: {
        validator: (experience) =>
          Array.isArray(experience) &&
          experience.length <= 20,

        message:
          "You can add a maximum of 20 experience entries.",
      },

      default: [],
    },

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

// ============================================
// HASH PASSWORD BEFORE SAVE
// ============================================

userSchema.pre("save", async function (next) {
  try {
    // Do not re-hash password when unrelated
    // user fields are updated.
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(
      this.password,
      salt
    );

    next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// COMPARE PASSWORD
// ============================================

userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  if (
    !candidatePassword ||
    !this.password
  ) {
    return false;
  }

  return bcrypt.compare(
    candidatePassword,
    this.password
  );
};

// ============================================
// EXPORT MODEL
// ============================================

module.exports = mongoose.model(
  "User",
  userSchema
);