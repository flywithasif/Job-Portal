const { validationResult } = require("express-validator");

// ============================================
// VALIDATION RESULT HANDLER
// ============================================

const validate = (req, res, next) => {
  const errors = validationResult(req);

  // No validation errors
  if (errors.isEmpty()) {
    return next();
  }

  // Format validation errors
  const formattedErrors = errors.array().map((error) => ({
    field: error.path || error.param || "unknown",
    message: error.msg,
  }));

  return res.status(400).json({
    success: false,
    message: "Validation failed.",
    errors: formattedErrors,
  });
};

module.exports = validate;