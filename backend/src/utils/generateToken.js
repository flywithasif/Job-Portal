const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  // ============================================
  // SECURITY CHECK
  // ============================================

  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured in environment variables."
    );
  }

  if (!userId) {
    throw new Error("User ID is required to generate JWT.");
  }

  // ============================================
  // GENERATE JWT
  // ============================================

  return jwt.sign(
    {
      userId: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",

      // Explicitly restrict JWT signing algorithm.
      algorithm: "HS256",
    }
  );
};

module.exports = generateToken;