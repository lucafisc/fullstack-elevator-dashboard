#! /usr/bin/env node
require('dotenv').config()
const fs = require("fs");
const mongoose = require("mongoose");
const Elevator = require("../dist/db/elevator.js").Elevator;
const Chart = require("../dist/db/chart.js").Chart;
const User = require("../dist/db/user.js").User; // Import the User model

const mongoDB = process.env.DB_URL;

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");

    const userName = process.argv[2]; // Get the username from the command line argument
    if (!userName) {
      throw new Error("Username not provided.");
    }

    await populateDB(userName);
    console.log("Populated DB");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

async function populateDB(userName) {
  const userData = fs.readFileSync(`dataInit/data/${userName}.json`);
  const parsedUserData = JSON.parse(userData);

  const user = await User.findOne({ "userInfo.email": `${userName}@test.com` });
  if (!user) {
    throw new Error(`User with email ${userName}@test.com not found.`);
  }

  for (const elevatorData of parsedUserData) {
    const elevatorDetail = {
      specifications: {
        fabricationNumber: elevatorData.fabricationNumber,
        address: elevatorData.address,
        deviceIdentificationNumber: elevatorData.deviceIdentificationNumber,
        manufacturerName: elevatorData.manufacturerName,
        productionYear: elevatorData.productionYear,
        elevatorType: elevatorData.elevatorType,
      },
      operationalState: {
        floorNumber: elevatorData.floorNumber,
        state: elevatorData.state,
      }
    };

    if (elevatorData.warningMessage) {
      elevatorDetail.operationalState.warningMessage = elevatorData.warningMessage;
    }

    if (elevatorData.reason) {
      elevatorDetail.operationalState.reason = elevatorData.reason;
    }

    if (elevatorData.chart) {
      const chart = new Chart({ ...elevatorData.chart });
      await chart.save();
      elevatorDetail.chart = chart;
    }

    const elevator = new Elevator(elevatorDetail);
    await elevator.save();

    user.elevators.push(elevator._id);
  }

  await user.save();
}

main();
