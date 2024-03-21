import mongoose from "mongoose";
import { Chart } from "./chart";
export const elevatorTypesEnum = ["Passenger", "Freight"];
export const stateEnum = ["operational", "out-of-order", "warning"];
export type StateEnum = (typeof stateEnum)[number];

const ElevatorSchema = new mongoose.Schema({
  specifications: {
    fabricationNumber: { type: String, required: true },
    address: { type: String, required: true },
    deviceIdentificationNumber: { type: String, required: true },
    manufacturerName: { type: String, required: true },
    productionYear: { type: Number, required: true },
    elevatorType: { type: String, enum: elevatorTypesEnum, required: true },
  },
  operationalState: {
    floorNumber: { type: Number, required: true },
    state: { type: String, enum: stateEnum, required: true },
    warningMessage: { type: String },
    reason: { type: String },
  },
  chart: { type: mongoose.Schema.Types.ObjectId, ref: Chart },
});

// export type of elevator, not interface

export type ElevatorInterface = {
  specifications: {
    fabricationNumber: string;
    address: string;
    deviceIdentificationNumber: string;
    manufacturerName: string;
    productionYear: number;
    elevatorType: string;
  };
  operationalState: {
    floorNumber: number;
    state: string;
    warningMessage: string;
    reason: string;
  };
  chart: mongoose.Schema.Types.ObjectId;
};

export const Elevator = mongoose.model("Elevator", ElevatorSchema);
