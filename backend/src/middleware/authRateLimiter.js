const rateLimit = require("express-rate-limit");

// ============================================
// AUTHENTICATION RATE LIMITER
// ============================================
//
// Protects authentication endpoints against:
// - Brute-force attacks
// - Credential stuffing
// - Automated login/register abuse
//
// Limit:
// 10 requests per IP every 15 minutes.
//

const authRateLimiter = rateLimit({
  // ------------------------------------------
  // TIME WINDOW
  // ------------------------------------------

  windowMs: 15 * 60 * 1000,

  // ------------------------------------------
  // REQUEST LIMIT
  // ------------------------------------------

  max: 10,

  // ------------------------------------------
  // RATE-LIMIT HEADERS
  // ------------------------------------------

  standardHeaders: true,
  legacyHeaders: false,

  // ------------------------------------------
  // RESPONSE MESSAGE
  // ------------------------------------------

  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later.",
  },

  // ------------------------------------------
  // CUSTOM 429 HANDLER
  // ------------------------------------------

  handler: (req, res) => {
    const resetTime = req.rateLimit?.resetTime;

    const retryAfter = resetTime
      ? Math.max(
          0,
          Math.ceil(
            (resetTime.getTime() - Date.now()) / 1000
          )
        )
      : undefined;

    return res.status(429).json({
      success: false,
      message:
        "Too many authentication attempts. Please try again later.",

      ...(retryAfter !== undefined && {
        retryAfter,
      }),
    });
  },
});

module.exports = authRateLimiter;