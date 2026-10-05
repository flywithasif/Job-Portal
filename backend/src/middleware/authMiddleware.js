const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const protect = async (req, res, next) => {
  try {
    // ==========================================
    // JWT SECRET CHECK
    // ==========================================

    if (!process.env.JWT_SECRET) {
      return next(
        new Error(
          "JWT_SECRET is not configured in environment variables."
        )
      );
    }

    // ==========================================
    // READ AUTHORIZATION HEADER
    // ==========================================

    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Must be exactly: Bearer <token>
    const [scheme, token] = authorization.trim().split(/\s+/);

    if (
      scheme !== "Bearer" ||
      !token ||
      authorization.trim().split(/\s+/).length !== 2
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication format.",
      });
    }

    // ==========================================
    // VERIFY JWT
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );

    // ==========================================
    // VALIDATE JWT PAYLOAD
    // ==========================================

    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findById(decoded.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // ==========================================
    // CHECK ACCOUNT STATUS
    // ==========================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // ==========================================
    // ATTACH USER TO REQUEST
    // ==========================================

    req.user = user;

    next();
  } catch (error) {
    // ==========================================
    // JWT ERRORS
    // ==========================================

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // ==========================================
    // OTHER ERRORS
    // ==========================================

    next(error);
  }
};

// ============================================
// ROLE-BASED AUTHORIZATION
// ============================================

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // User must already be authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Check user role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};