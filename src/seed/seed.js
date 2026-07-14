require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const users = [
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "Admin123",
    role: "admin",
  },
  {
    name: "Test User One",
    email: "user1@test.com",
    password: "User1123",
    role: "user",
  },
  {
    name: "Test User Two",
    email: "user2@test.com",
    password: "User2123",
    role: "user",
  },
];

const seed = async () => {
  await connectDB();

  await User.deleteMany({ email: { $in: users.map((u) => u.email) } });

  // Passwords are hashed automatically by the User model's pre-save hook.
  await User.create(users);

  console.log("Seed data created:");
  users.forEach((u) => console.log(`  - ${u.role.padEnd(5)} ${u.email} / ${u.password}`));

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
