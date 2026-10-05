const User = require("../models/User");
const generateToken = require("../utils/generateToken");

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
        message: "Name, email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ==========================================
    // PUBLIC ROLE RESTRICTION
    // ==========================================
    //
    // Public registration can ONLY create:
    // JOB_SEEKER or RECRUITER.
    //
    // ADMIN / SUPER_ADMIN must NEVER be created
    // through the public registration endpoint.
    //

    const allowedRole =
      role === "RECRUITER"
        ? "RECRUITER"
        : "JOB_SEEKER";

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
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone:
        typeof phone === "string"
          ? phone.trim()
          : "",
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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePhoto: user.profilePhoto,
          isEmailVerified: user.isEmailVerified,
        },
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

    const normalizedEmail = email.trim().toLowerCase();

    // ==========================================
    // FIND USER
    // ==========================================
    //
    // Password is select:false in User model,
    // therefore explicitly include it for login.
    //

    const user = await User.findOne({
      email: normalizedEmail,
    }).select(
      "+password"
    );

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
      }
    );

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
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePhoto: user.profilePhoto,
          isEmailVerified:
            user.isEmailVerified,
          lastLoginAt,
        },
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

const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
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
          isEmailVerified:
            user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
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