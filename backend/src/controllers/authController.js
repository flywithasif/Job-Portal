const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ============================================
// SAFE USER RESPONSE
// ============================================
//
// Never return password or other sensitive
// internal account data from auth responses.
//

const buildSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profilePhoto: user.profilePhoto,
  headline: user.headline,
  location: user.location,
  bio: user.bio,
  skills: user.skills,
  resumeUrl: user.resumeUrl,
  linkedinUrl: user.linkedinUrl,
  portfolioUrl: user.portfolioUrl,
  education: user.education,
  experience: user.experience,
  isActive: user.isActive,
  isEmailVerified: user.isEmailVerified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ============================================
// REGISTER
// ============================================

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
    } = req.body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    // ==========================================
    // NORMALIZE INPUT
    // ==========================================

    const normalizedName = name.trim();

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const normalizedPhone =
      typeof phone === "string"
        ? phone.trim()
        : "";

    // ==========================================
    // NAME VALIDATION
    // ==========================================

    if (
      normalizedName.length < 2 ||
      normalizedName.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name must be between 2 and 100 characters.",
      });
    }

    // ==========================================
    // PUBLIC ROLE RESTRICTION
    // ==========================================
    //
    // Public registration can ONLY create:
    //
    // JOB_SEEKER
    // RECRUITER
    //
    // ADMIN and SUPER_ADMIN can NEVER be created
    // through this endpoint.
    //

    let allowedRole = "JOB_SEEKER";

    if (role === "RECRUITER") {
      allowedRole = "RECRUITER";
    }

    // ==========================================
    // CHECK EXISTING USER
    // ==========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("_id");

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    // ==========================================
    // CREATE USER
    // ==========================================

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      phone: normalizedPhone,
      role: allowedRole,
    });

    // ==========================================
    // GENERATE JWT
    // ==========================================

    const token = generateToken(user._id);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        user: buildSafeUser(user),
        token,
      },
    });
  } catch (error) {
    // ==========================================
    // DUPLICATE EMAIL RACE CONDITION
    // ==========================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    next(error);
  }
};

// ============================================
// LOGIN
// ============================================

const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // ==========================================
    // NORMALIZE EMAIL
    // ==========================================

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // ==========================================
    // FIND USER
    // ==========================================
    //
    // Password is select:false in User model.
    // Explicitly include it only for authentication.
    //

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    // ==========================================
    // INVALID CREDENTIALS
    // ==========================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated.",
      });
    }

    // ==========================================
    // PASSWORD CHECK
    // ==========================================

    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ==========================================
    // UPDATE LAST LOGIN
    // ==========================================

    const lastLoginAt = new Date();

    await User.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          lastLoginAt,
        },
      },
    );

    user.lastLoginAt = lastLoginAt;

    // ==========================================
    // GENERATE JWT
    // ==========================================

    const token = generateToken(user._id);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        user: buildSafeUser(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET CURRENT USER
// ============================================
//
// GET /api/auth/me
//
// Authentication middleware verifies the token
// and attaches the user to req.user.
//

const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: buildSafeUser(req.user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// EXPORT
// ============================================

module.exports = {
  register,
  login,
  getMe,
};