const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    role: {
      type: String,
      enum: [
        "JOB_SEEKER",
        "RECRUITER",
        "ADMIN",
        "SUPER_ADMIN",
      ],
      default: "JOB_SEEKER",
      index: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);

  this.password = await bcrypt.hash(
    this.password,
    salt
  );

  next();
});

// Compare password during login
userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(
    candidatePassword,
    this.password
  );
};

module.exports = mongoose.model("User", userSchema);