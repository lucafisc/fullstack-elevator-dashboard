#! /usr/bin/env node
require('dotenv').config()
const mongoose = require("mongoose");
const User = require("../dist/db/user.js").User;
const Elevator = require("../dist/db/elevator.js").Elevator;

const mongoDB = process.env.DB_URL;

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");

    await populateTestUser();
    console.log("Assigned all elevators to test user");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

async function populateTestUser() {
  const testUser = await User.findOne({ "userInfo.email": "testuser@test.com" });
  if (!testUser) {
    throw new Error("Test user with email testuser@test.com not found.");
  }

  const elevators = await Elevator.find({});
  if (!elevators || elevators.length === 0) {
    throw new Error("No elevators found in the database.");
  }

  elevators.forEach(elevator => {
    testUser.elevators.push(elevator._id);
  });

  await testUser.save();
}

main();