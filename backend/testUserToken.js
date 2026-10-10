
require("dotenv").config();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/users");

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ role: "user" }).select("_id email role");

    if (!user) {
      console.log("NO_NORMAL_USER_FOUND");
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "10m" }
    );

    console.log("NORMAL_USER_FOUND");
    console.log("Role:", user.role);
    console.log("Email:", user.email);
    console.log("Temporary test token generated. Do not share it.");
    require("fs").writeFileSync(".normal-user-test-token", token, { mode: 0o600 });
    console.log("Token saved to .normal-user-test-token");
  } catch (error) {
    console.error("Test setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

main();
