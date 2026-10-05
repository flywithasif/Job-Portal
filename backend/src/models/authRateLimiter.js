const rateLimit = require("express-rate-limit");

// ============================================
// AUTH RATE LIMITER
// ============================================
//
// Protects login/register endpoints from
// brute-force and automated abuse.
//
// 10 failed/attempted requests per 15 minutes
// per IP.
//
// IMPORTANT:
// This is intentionally separate from the
// general API rate limiter.
//

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many authentication attempts. Please try again later.",
      retryAfter: Math.ceil(
        (req.rateLimit?.resetTime?.getTime() -
          Date.now()) /
          1000
      ),
    });
  },
});

module.exports = authRateLimiter;