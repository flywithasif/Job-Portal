require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
========================================
        JOB PORTAL API SERVER
========================================
Server:      http://localhost:${PORT}
API:         http://localhost:${PORT}/api
Health:      http://localhost:${PORT}/api/health
Environment: ${process.env.NODE_ENV}
========================================
      `);
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