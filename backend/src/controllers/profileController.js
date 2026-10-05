const User = require("../models/User");

// ============================================
// ALLOWED PROFILE FIELDS
// ============================================
//
// Only these fields can be changed through the
// profile endpoint.
//
// Sensitive account fields such as:
// - email
// - password
// - role
// - isActive
// - isEmailVerified
// - lastLoginAt
//
// are intentionally excluded.
//

const allowedFields = [
  "name",
  "phone",
  "profilePhoto",
  "headline",
  "location",
  "bio",
  "skills",
  "resumeUrl",
  "linkedinUrl",
  "portfolioUrl",
  "education",
  "experience",
];

// ============================================
// URL FIELDS
// ============================================

const urlFields = [
  "profilePhoto",
  "resumeUrl",
  "linkedinUrl",
  "portfolioUrl",
];

// ============================================
// STRING FIELDS
// ============================================

const stringFields = [
  "name",
  "phone",
  "profilePhoto",
  "headline",
  "location",
  "bio",
  "resumeUrl",
  "linkedinUrl",
  "portfolioUrl",
];

// ============================================
// ARRAY FIELDS
// ============================================

const arrayFields = [
  "skills",
  "education",
  "experience",
];

// ============================================
// STRING LENGTH LIMITS
// ============================================

const stringLimits = {
  name: 100,
  phone: 20,
  profilePhoto: 2048,
  headline: 200,
  location: 200,
  bio: 5000,
  resumeUrl: 2048,
  linkedinUrl: 2048,
  portfolioUrl: 2048,
};

// ============================================
// URL VALIDATION
// ============================================

const validateUrl = (value) => {
  // Empty URL is allowed because these fields
  // are optional.
  if (value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  try {
    const parsedUrl = new URL(value);

    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:"
    );
  } catch {
    return false;
  }
};

// ============================================
// GET MY PROFILE
// ============================================
//
// GET /api/profile/me
//
// Returns the authenticated user's profile.
//

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE MY PROFILE
// ============================================
//
// PATCH /api/profile/me
//
// Only explicitly allowed profile fields can be
// updated.
//

const updateMyProfile = async (req, res, next) => {
  try {
    // ==========================================
    // REQUEST BODY CHECK
    // ==========================================

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body.",
      });
    }

    // ==========================================
    // REJECT UNKNOWN FIELDS
    // ==========================================

    const requestedFields = Object.keys(req.body);

    const invalidFields = requestedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more fields cannot be updated.",
        fields: invalidFields,
      });
    }

    // ==========================================
    // FIND AUTHENTICATED USER
    // ==========================================

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ==========================================
    // UPDATE ONLY ALLOWED FIELDS
    // ==========================================

    for (const field of allowedFields) {
      // PATCH behaviour:
      // If field is not sent, keep existing value.
      if (req.body[field] === undefined) {
        continue;
      }

      const value = req.body[field];

      // ========================================
      // STRING VALIDATION
      // ========================================

      if (
        stringFields.includes(field) &&
        typeof value !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a string.`,
        });
      }

      // ========================================
      // STRING LENGTH VALIDATION
      // ========================================

      if (stringFields.includes(field)) {
        const trimmedValue = value.trim();

        if (
          trimmedValue.length >
          stringLimits[field]
        ) {
          return res.status(400).json({
            success: false,
            message:
              `${field} cannot exceed ${stringLimits[field]} characters.`,
          });
        }
      }

      // ========================================
      // ARRAY VALIDATION
      // ========================================

      if (
        arrayFields.includes(field) &&
        !Array.isArray(value)
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be an array.`,
        });
      }

      // ========================================
      // URL VALIDATION
      // ========================================

      if (
        urlFields.includes(field) &&
        !validateUrl(value)
      ) {
        return res.status(400).json({
          success: false,
          message:
            `${field} must be a valid HTTP or HTTPS URL.`,
        });
      }

      // ========================================
      // NAME VALIDATION
      // ========================================

      if (field === "name") {
        const trimmedName = value.trim();

        if (trimmedName.length < 2) {
          return res.status(400).json({
            success: false,
            message:
              "Name must be at least 2 characters.",
          });
        }

        user.set("name", trimmedName);

        continue;
      }

      // ========================================
      // PHONE VALIDATION
      // ========================================

      if (field === "phone") {
        const trimmedPhone = value.trim();

        user.set("phone", trimmedPhone);

        continue;
      }

      // ========================================
      // SKILLS VALIDATION
      // ========================================

      if (field === "skills") {
        if (value.length > 50) {
          return res.status(400).json({
            success: false,
            message:
              "You can add a maximum of 50 skills.",
          });
        }

        const invalidSkill = value.some(
          (skill) =>
            typeof skill !== "string" ||
            skill.trim().length === 0 ||
            skill.trim().length > 80
        );

        if (invalidSkill) {
          return res.status(400).json({
            success: false,
            message:
              "Each skill must be a non-empty string of maximum 80 characters.",
          });
        }

        const normalizedSkills = value.map(
          (skill) => skill.trim()
        );

        user.set("skills", normalizedSkills);

        continue;
      }

      // ========================================
      // EDUCATION VALIDATION
      // ========================================

      if (field === "education") {
        if (value.length > 20) {
          return res.status(400).json({
            success: false,
            message:
              "You can add a maximum of 20 education entries.",
          });
        }

        const invalidEducation = value.some(
          (education) =>
            !education ||
            typeof education !== "object" ||
            Array.isArray(education)
        );

        if (invalidEducation) {
          return res.status(400).json({
            success: false,
            message:
              "Each education entry must be a valid object.",
          });
        }

        user.set("education", value);

        continue;
      }

      // ========================================
      // EXPERIENCE VALIDATION
      // ========================================

      if (field === "experience") {
        if (value.length > 20) {
          return res.status(400).json({
            success: false,
            message:
              "You can add a maximum of 20 experience entries.",
          });
        }

        const invalidExperience = value.some(
          (experience) =>
            !experience ||
            typeof experience !== "object" ||
            Array.isArray(experience)
        );

        if (invalidExperience) {
          return res.status(400).json({
            success: false,
            message:
              "Each experience entry must be a valid object.",
          });
        }

        user.set("experience", value);

        continue;
      }

      // ========================================
      // OTHER STRING FIELDS
      // ========================================

      if (typeof value === "string") {
        user.set(field, value.trim());
      } else {
        user.set(field, value);
      }
    }

    // ==========================================
    // SAVE UPDATED USER
    // ==========================================

    await user.save();

    // ==========================================
    // RETURN SAFE USER DATA
    // ==========================================

    const safeUser = await User.findById(
      user._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: safeUser,
    });
  } catch (error) {
    // ==========================================
    // MONGOOSE VALIDATION ERROR
    // ==========================================

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Profile validation failed.",
        errors: Object.values(error.errors).map(
          (validationError) => ({
            field: validationError.path,
            message: validationError.message,
          })
        ),
      });
    }

    // ==========================================
    // OTHER ERRORS
    // ==========================================

    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};