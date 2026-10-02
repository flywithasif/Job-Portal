const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();

// ------------------------------
// Security Middleware
// ------------------------------

app.use(helmet());

// ------------------------------
// CORS
// ------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// ------------------------------
// Rate Limiting
// ------------------------------

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api", apiLimiter);

// ------------------------------
// Body Parsers
// ------------------------------

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ------------------------------
// Cookie Parser
// ------------------------------

app.use(cookieParser());

// ------------------------------
// Logger
// ------------------------------

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ------------------------------
// Health Check
// ------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------
// API Root
// ------------------------------

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Job Portal API",
    version: "1.0.0",
  });
});

// ------------------------------
// 404 Handler
// ------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ------------------------------
// Global Error Handler
// ------------------------------

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

module.exports = app;