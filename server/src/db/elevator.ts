import mongoose from "mongoose";
import { Chart } from "./chart";
export const elevatorTypesEnum = ["Passenger", "Freight"];
export const stateEnum = ['operational', 'out-of-order', 'warning'];
export type StateEnum = typeof stateEnum[number];

const ElevatorSchema = new mongoose.Schema({
    fabricationNumber: { type: String, required: true },
    address: { type: String, required: true },
    floorNumber: { type: Number, required: true },
    deviceIdentificationNumber: { type: String, required: true },
    manufacturerName: { type: String, required: true },
    productionYear: { type: Number, required: true },
    elevatorType: { type: String, enum: elevatorTypesEnum, required: true },
    state: { type: String, enum: stateEnum, required: true },
    warningMessage: { type: String },
    reason: { type: String },
    chart: { type: mongoose.Schema.Types.ObjectId, ref: Chart }
});

export const Elevator = mongoose.model('Elevator', ElevatorSchema);
