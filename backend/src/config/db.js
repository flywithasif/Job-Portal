const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      // ------------------------------------------
      // Connection timeout
      // ------------------------------------------
      serverSelectionTimeoutMS: 10000,

      // ------------------------------------------
      // Connection pool
      // ------------------------------------------
      maxPoolSize: 10,
      minPoolSize: 2,

      // ------------------------------------------
      // Keep connections alive
      // ------------------------------------------
      socketTimeoutMS: 45000,

      // ------------------------------------------
      // Faster initial connection handling
      // ------------------------------------------
      family: 4,
    });

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );

    console.log(
      `MongoDB database: ${connection.connection.name}`
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;