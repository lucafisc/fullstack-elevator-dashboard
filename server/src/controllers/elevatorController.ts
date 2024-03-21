import { User } from "../db/user";
import { Elevator, stateEnum, ElevatorInterface } from "../db/elevator";
import type { StateEnum } from "../db/elevator";
import { RecentlyVisitedElevator } from "../db/recentlyViewed";
import asyncHandler from "express-async-handler";
import { get } from "axios";
import { Request } from "express";


// Function to get user's elevators
const getUserElevators = async (req : Request) => {
  const user = req.user as typeof User & { elevators: string[] };
  const userElevatorsIds = user.elevators;
  const elevators = await Elevator.find({ _id: { $in: userElevatorsIds } });
  console.log("ALSO USER ELEVATORS", elevators);
  return elevators;
};

// GET all elevators
export const getElevators = asyncHandler(async (req, res) => {
  const elevators = await getUserElevators(req);

  if (elevators.length === 0) {
    res.status(404).json({ message: "User not found or no elevators found" });
    return;
  }

  res.json(elevators);
});

// GET elevators count by state
export const getElevatorsCountByState = asyncHandler(async (req, res) => {
  const countByState: Record<StateEnum, number> = {
    "operational": 0,
    "out-of-order": 0,
    "warning": 0,
  };

  const elevators = await getUserElevators(req);

  elevators.forEach(elevator => {
    const operationalState = elevator.operationalState.state;
    countByState[operationalState]++;
  });

  res.json(countByState);
});


// GET recently visited elevators
export const getRecentlyVisitedElevators = asyncHandler(async (req, res) => {
  const recentlyVisitedElevators =
    await RecentlyVisitedElevator.find().populate("elevator");
  res.json(recentlyVisitedElevators);
});

// GET elevators by state
export const getElevatorsByState = asyncHandler(async (req, res) => {
  const state = req.params.state as StateEnum;
  if (!Object.values(stateEnum).includes(state)) {
    res.status(404);
    res.json({ message: "State not found" });
    return;
  }

  const elevators = await getUserElevators(req);
  const filteredElevators = elevators.filter(elevator => elevator.operationalState.state === state);
  res.json(filteredElevators);
});

// GET elevator by id
export const getElevatorById = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ "userInfo.auth0Id": req.auth.sub });
  const userIdArray = user.elevators.map(elevator => elevator._id.toString());
  const belongsToUser = userIdArray.includes(req.params.id);

  if (!belongsToUser) {
    res.status(403);
    res.json({ message: "Elevator does not belong to user" });
    return;
  }

  const elevator = await Elevator.findById(req.params.id).populate("chart");

  if (!elevator) {
    res.status(404);
    res.json({ message: "Elevator not found" });
    return;
  }

  const recentlyVisitedElevator = new RecentlyVisitedElevator({
    elevator: req.params.id,
    visitedAt: new Date(),
  });
  
  await recentlyVisitedElevator.save();
  res.json(elevator);
});
