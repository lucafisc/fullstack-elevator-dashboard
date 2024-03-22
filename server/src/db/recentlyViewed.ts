import mongoose from "mongoose";
import { Elevator } from "./elevator";

const RecentlyVisitedElevatorSchema = new mongoose.Schema({
    elevator: { type: mongoose.Schema.Types.ObjectId, ref: 'Elevator', required: true },
    visitedAt: { type: Date, default: Date.now, required: true }
  });
  

  // RecentlyVisitedElevatorSchema.pre('save', async function (next) {
  //   const doc = this;
    
  //   const existingElevators = await RecentlyVisitedElevator.find({ elevator: doc.elevator });
  //     if (existingElevators.length > 0) {
  //     await RecentlyVisitedElevator.deleteMany({ elevator: doc.elevator });
  //   }
  //   next();
  // });
  
  // RecentlyVisitedElevatorSchema.post('save', async function (doc, next) {
  //   const recentlyVisitedElevators = await RecentlyVisitedElevator.find().sort({ visitedAt: -1 }).skip(10);
  //   if (recentlyVisitedElevators.length > 0) {
  //     await RecentlyVisitedElevator.deleteMany({ _id: { $in: recentlyVisitedElevators.map(e => e._id) } });
  //   }
  //   next();
  // });
  
  
  export const RecentlyVisitedElevator = mongoose.model('RecentlyVisitedElevator', RecentlyVisitedElevatorSchema);