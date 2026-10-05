require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

// ============================================
// CONFIGURATION
// ============================================

const PORT = process.env.PORT || 5000;

// ============================================
// TRUST PROXY
// ============================================
//
// Required when deployed behind a reverse proxy
// such as Render, Railway, Vercel, Nginx, etc.
//
// This also allows express-rate-limit to correctly
// determine the client's IP in production.
//

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
  try {
    // ==========================================
    // CONNECT MONGODB
    // ==========================================

    await connectDB();

    // ==========================================
    // START EXPRESS SERVER
    // ==========================================

    const server = app.listen(PORT, () => {
      console.log(`
========================================
        JOB PORTAL API SERVER
========================================
Server:      http://localhost:${PORT}
API:         http://localhost:${PORT}/api
Health:      http://localhost:${PORT}/api/health
Environment: ${process.env.NODE_ENV || "development"}
========================================
      `);
    });

    // ==========================================
    // GRACEFUL SHUTDOWN
    // ==========================================

    const shutdown = async (signal) => {
      console.log(
        `\n${signal} received. Shutting down server...`
      );

      server.close(async () => {
        console.log("HTTP server closed.");

        try {
          const mongoose = require("mongoose");

          await mongoose.connection.close();

          console.log("MongoDB connection closed.");
          process.exit(0);
        } catch (error) {
          console.error(
            "Error while closing MongoDB:",
            error.message
          );

          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => {
      shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      shutdown("SIGINT");
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();