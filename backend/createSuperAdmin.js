require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./src/models/User");

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "superadmin@test.com";
    const password = "Admin@12345";

    let user = await User.findOne({ email });

    if (user) {
      user.name = "Super Admin";
      user.password = password;
      user.role = "SUPER_ADMIN";
      user.isActive = true;
      user.isEmailVerified = true;

      await user.save();

      console.log("\n========================================");
      console.log("SUPER ADMIN UPDATED");
      console.log("========================================");
    } else {
      user = await User.create({
        name: "Super Admin",
        email,
        password,
        role: "SUPER_ADMIN",
        isActive: true,
        isEmailVerified: true,
      });

      console.log("\n========================================");
      console.log("SUPER ADMIN CREATED");
      console.log("========================================");
    }

    console.log("Email:    superadmin@test.com");
    console.log("Password: Admin@12345");
    console.log("Role:     SUPER_ADMIN");
    console.log("========================================\n");

    await mongoose.disconnect();
  } catch (error) {
    console.error("\nFailed:", error.message);
    process.exit(1);
  }
};

createSuperAdmin();
