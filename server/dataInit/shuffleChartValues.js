#! /usr/bin/env node
require('dotenv').config()
const mongoose = require("mongoose");
const Chart = require("../dist/db/chart.js").Chart;

const mongoDB = process.env.DB_URL;

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("Connected to MongoDB");

    const charts = await Chart.find({});

    for (const chart of charts) {
      chart.data.forEach(dataPoint => {
        dataPoint.door_cycles_count = getRandomValue();
        dataPoint.door_openings_count = getRandomValue();
        dataPoint.door_closings_count = getRandomValue();
        dataPoint.door_closed_count = getRandomValue();
        dataPoint.door_opened_count = getRandomValue();
      });

      await chart.save();
    }

    console.log("Data attributes updated successfully");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

function getRandomValue() {
  return Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
}

main();
