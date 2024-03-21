import mongoose from "mongoose";
import { Elevator } from "./elevator";
import {RecentlyVisitedElevator} from "./recentlyViewed";

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
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: RecentlyVisitedElevator }],
});

export const User = mongoose.model("User", UserSchema);
