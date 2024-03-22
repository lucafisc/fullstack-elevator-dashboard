import mongoose from "mongoose";

const ChartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: [
    {
      time: { type: Date, required: true },
      door_cycles_count: { type: Number, required: true },
      door_openings_count: { type: Number, required: true },
      door_closings_count: { type: Number, required: true },
      door_closed_count: { type: Number, required: true },
      door_opened_count: { type: Number, required: true },
    },
  ],
});

export const Chart = mongoose.model("Chart", ChartSchema);
