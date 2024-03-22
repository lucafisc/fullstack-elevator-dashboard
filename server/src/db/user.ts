import mongoose from "mongoose";
import { Elevator } from "./elevator";

const UserSchema = new mongoose.Schema({
  userInfo: {
    auth0Id: { type: String, required: true },
    nickname: { type: String },
    name: { type: String },
    picture: { type: String },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
  },
  elevators: [{ type: mongoose.Schema.Types.ObjectId, ref: Elevator }],
  recentlyViewed: [{
    elevator: { type: mongoose.Schema.Types.ObjectId, ref: Elevator },
    visitedAt: { type: Date, default: Date.now }
  }],
});

export const User = mongoose.model("User", UserSchema);
