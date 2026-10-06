const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

// ============================================
// ROUTES
// ============================================

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();

// ============================================
// SECURITY HEADERS
// ============================================

app.use(helmet());

// ============================================
// CORS
// ============================================

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header.
      // Example: Postman, server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("CORS policy: Origin not allowed.")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ============================================
// GENERAL API RATE LIMIT
// ============================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: "draft-7",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ============================================
// BODY PARSER
// ============================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

// ============================================
// COOKIE
// ============================================

app.use(cookieParser());

// ============================================
// LOGGER
// ============================================

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// API ROOT
// ============================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Job Portal API",
    version: "1.0.0",
  });
});

// ============================================
// API ROUTES
// ============================================

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/companies", companyRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

app.use("/api/profile", profileRoutes);

app.use("/api/admin", adminRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/interviews",
  interviewRoutes
);

// ============================================
// 404 - ROUTE NOT FOUND
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  // CORS error
  if (
    err.message ===
    "CORS policy: Origin not allowed."
  ) {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed.",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(
      (error) => ({
        field: error.path,
        message: error.message,
      })
    );

    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message:
        "A record with the provided value already exists.",
    });
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID.",
    });
  }

  // Production-safe error response
  const statusCode =
    err.statusCode &&
    Number.isInteger(err.statusCode)
      ? err.statusCode
      : 500;

  const message =
    statusCode >= 500 &&
    process.env.NODE_ENV === "production"
      ? "Internal server error."
      : err.message || "Internal server error.";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;