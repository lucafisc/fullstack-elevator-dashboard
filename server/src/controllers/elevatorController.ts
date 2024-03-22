import { User } from "../db/user";
import { Elevator, stateEnum, ElevatorInterface } from "../db/elevator";
import type { StateEnum } from "../db/elevator";
import asyncHandler from "express-async-handler";
import { Request } from "express";

const extractUserFromReq = (req: Request) => {
  return req.user as typeof User & { elevators: string[] } & {
    recentlyViewed: [{ elevator: string; visitedAt: Date }];
  };
};

// Function to get user's elevators
const getUserElevators = async (req: Request) => {
  const user = extractUserFromReq(req);
  const userElevatorsIds = user.elevators;
  const elevators = await Elevator.find({ _id: { $in: userElevatorsIds } });
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
    operational: 0,
    "out-of-order": 0,
    warning: 0,
  };

  const elevators = await getUserElevators(req);

  elevators.forEach((elevator) => {
    const operationalState = elevator.operationalState.state;
    countByState[operationalState]++;
  });

  res.json(countByState);
});

// GET recently visited elevators
export const getRecentlyVisitedElevators = asyncHandler(async (req, res) => {
  const user = extractUserFromReq(req);
  const recentElevators = user.recentlyViewed.map((entry) =>
    entry.elevator.toString()
  );
  const elevators = await Elevator.find({ _id: { $in: recentElevators } });

  res.json(elevators);
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
  const filteredElevators = elevators.filter(
    (elevator) => elevator.operationalState.state === state
  );
  res.json(filteredElevators);
});

// GET elevator by id
export const getElevatorById = asyncHandler(async (req, res, next) => {
  const elevatorId = req.params.id;
  console.log("Elevator id that was visited: ", elevatorId);
  const user = extractUserFromReq(req);
  const userElevatorsIds = user.elevators;
  const belongsToUser = userElevatorsIds.includes(elevatorId);

  if (!belongsToUser) {
    res.status(403);
    res.json({ message: "Elevator does not belong to user" });
    return;
  }

  const elevator = await Elevator.findById(elevatorId).populate("chart");
  if (!elevator) {
    res.status(404);
    res.json({ message: "Elevator not found" });
    return;
  }

   const visitedAt = new Date();
   const UserModel = await User.findOne({ "userInfo.auth0Id": req.auth.sub });

    const existingIndex = UserModel.recentlyViewed.findIndex(entry => entry.elevator.toString() === elevatorId);
    if (existingIndex !== -1) {
      // If elevator exists, remove it from current position and push it to the end
      console.log("Removing elevator at index: ", existingIndex, " with id: ", elevatorId);
      const existingEntry = UserModel.recentlyViewed.splice(existingIndex, 1)[0];

      existingEntry.visitedAt = visitedAt;
      UserModel.recentlyViewed.push(existingEntry);
    } else {
      // If elevator is not found, create a new entry
      UserModel.recentlyViewed.push({
        elevator: elevatorId,
        visitedAt: visitedAt,
      });
    }
  
    await UserModel.save();
    console.log("UserModel after saving: ", UserModel.recentlyViewed);


  res.json(elevator);
});
