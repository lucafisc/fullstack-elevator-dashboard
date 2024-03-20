#! /usr/bin/env node

// Get arguments passed on command line
require('dotenv').config()
const fs = require("fs");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
console.log(process.cwd());
const Elevator = require("../dist/db/elevator.js").Elevator;
const Chart = require("../dist/db/chart.js").Chart;
const mongoDB = process.env.DB_URL;
console.log("pwd", process.cwd());
console.log("mongoDB", mongoDB);
console.log("chart", Chart);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB");
  await populateDB();
  console.log("Populated DB");
  mongoose.connection.close();
}

async function populateDB() {
  console.log(process.cwd());
  const data = fs.readFileSync("dataInit/data/skyward-peaks.json");
  const parsedData = JSON.parse(data);

  for (const elevatorData of parsedData) {
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
  }
}
