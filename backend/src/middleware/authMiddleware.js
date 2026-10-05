const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
//
// Verifies JWT and attaches the authenticated
// user to req.user.
//

const protect = async (req, res, next) => {
  try {
    // ==========================================
    // JWT SECRET CHECK
    // ==========================================

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return next(
        new Error(
          "JWT_SECRET is not configured in environment variables."
        )
      );
    }

    // ==========================================
    // JWT SECRET STRENGTH CHECK
    // ==========================================

    if (jwtSecret.length < 32) {
      return next(
        new Error(
          "JWT_SECRET must be at least 32 characters long."
        )
      );
    }

    // ==========================================
    // READ AUTHORIZATION HEADER
    // ==========================================

    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please login.",
      });
    }

    // ==========================================
    // PARSE BEARER TOKEN
    // ==========================================

    const authorizationParts =
      authorization.trim().split(/\s+/);

    if (
      authorizationParts.length !== 2 ||
      authorizationParts[0] !== "Bearer" ||
      !authorizationParts[1]
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication format.",
      });
    }

    const token = authorizationParts[1];

    // ==========================================
    // VERIFY JWT
    // ==========================================

    const decoded = jwt.verify(
      token,
      jwtSecret,
      {
        algorithms: ["HS256"],
      }
    );

    // ==========================================
    // VALIDATE JWT PAYLOAD
    // ==========================================

    if (
      !decoded ||
      typeof decoded.userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(
        decoded.userId
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================
    //
    // Password is explicitly excluded.
    //

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    // ==========================================
    // USER NOT FOUND
    // ==========================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User no longer exists.",
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
    // ATTACH USER TO REQUEST
    // ==========================================

    req.user = user;

    return next();
  } catch (error) {
    // ==========================================
    // TOKEN EXPIRED
    // ==========================================

    if (
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Token has expired. Please login again.",
      });
    }

    // ==========================================
    // INVALID JWT
    // ==========================================

    if (
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    // ==========================================
    // TOKEN NOT ACTIVE YET
    // ==========================================

    if (
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token is not active yet.",
      });
    }

    // ==========================================
    // OTHER ERRORS
    // ==========================================

    return next(error);
  }
};

// ============================================
// ROLE-BASED AUTHORIZATION
// ============================================
//
// Usage:
//
// authorize("JOB_SEEKER")
// authorize("RECRUITER")
// authorize("ADMIN", "SUPER_ADMIN")
//
// Authentication must run before this middleware.
//

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // ==========================================
    // AUTHENTICATION CHECK
    // ==========================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ==========================================
    // ROLE CONFIGURATION CHECK
    // ==========================================

    if (
      allowedRoles.length === 0 ||
      !allowedRoles.every(
        (role) => typeof role === "string"
      )
    ) {
      return next(
        new Error(
          "Authorization roles are not configured correctly."
        )
      );
    }

    // ==========================================
    // ROLE CHECK
    // ==========================================

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource.",
      });
    }

    // ==========================================
    // AUTHORIZED
    // ==========================================

    return next();
  };
};

// ============================================
// EXPORT
// ============================================

module.exports = {
  protect,
  authorize,
};