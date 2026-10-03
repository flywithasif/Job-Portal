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

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    /*
      IMPORTANT:
      Public registration can only create
      JOB_SEEKER or RECRUITER.

      ADMIN/SUPER_ADMIN cannot be created
      through public registration.
    */

    const allowedRole =
      role === "RECRUITER"
        ? "RECRUITER"
        : "JOB_SEEKER";

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || "",
      role: allowedRole,
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Password is select:false in model,
    // so explicitly select it here.
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // Compare password
    const isPasswordCorrect =
      await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Update login time
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
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
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
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
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
