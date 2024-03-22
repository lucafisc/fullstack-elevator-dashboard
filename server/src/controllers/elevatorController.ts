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

const getUserElevators = async (req: Request) => {
  const user = extractUserFromReq(req);
  const userElevatorsIds = user.elevators;
  const elevators = await Elevator.find({ _id: { $in: userElevatorsIds } });
  return elevators;
};

// GET all elevators
export const getElevators = asyncHandler(async (req, res) => {
  const elevators = await getUserElevators(req);

  res.json(elevators);
});

// GET elevators count by state
export const getElevatorsCountByState = asyncHandler(async (req, res) => {
  const elevators = await getUserElevators(req);

  // Count
  const countByState: Record<StateEnum, number> = {
    operational: 0,
    "out-of-order": 0,
    warning: 0,
  };
  elevators.forEach((elevator) => {
    const operationalState = elevator.operationalState.state;
    countByState[operationalState]++;
  });

  res.json(countByState);
});

// GET recently visited elevators
export const getRecentlyVisitedElevators = asyncHandler(async (req, res) => {
  const user = extractUserFromReq(req);
  const recentElevators = user.recentlyViewed.map((entry) => ({
    elevator: entry.elevator.toString(),
    visitedAt: entry.visitedAt,
  }));

  // Populate elevators
  const populatedElevators = await Promise.all(
    recentElevators.map(async (entry) => {
      const elevator = await Elevator.findById(entry.elevator).exec();
      return {
        elevator,
        visitedAt: entry.visitedAt,
      };
    }),
  );

  res.json(populatedElevators);
});

// GET elevators by state
export const getElevatorsByState = asyncHandler(async (req, res) => {
  const state = req.params.state as StateEnum;
  if (!Object.values(stateEnum).includes(state)) {
    res.status(404);
    res.json({ message: "Not a valid state" });
    return;
  }

  const elevators = await getUserElevators(req);
  const filteredElevators = elevators.filter(
    (elevator) => elevator.operationalState.state === state,
  );

  res.json(filteredElevators);
});

// GET elevator by id
export const getElevatorById = asyncHandler(async (req, res, next) => {
  const elevatorId = req.params.id;
  const user = extractUserFromReq(req);
  const belongsToUser = user.elevators.includes(elevatorId);
  if (!belongsToUser) {
    res.status(403);
    res.json({ message: "Elevator does not belong to user" });
    return;
  }

  // Get elevator and populate chart
  const elevator = await Elevator.findById(elevatorId).populate("chart");
  if (!elevator) {
    res.status(404);
    res.json({ message: "Elevator not found" });
    return;
  }

  // Register visit
  const visitedAt = new Date();
  const UserModel = await User.findOne({ "userInfo.auth0Id": req.auth.sub });
  const existingIndex = UserModel.recentlyViewed.findIndex(
    (entry) => entry.elevator.toString() === elevatorId,
  );
  if (existingIndex !== -1) {
    // Existing elevator, update visitedAt and push to end
    const existingEntry = UserModel.recentlyViewed.splice(existingIndex, 1)[0];
    existingEntry.visitedAt = visitedAt;
    UserModel.recentlyViewed.push(existingEntry);
  } else {
    // New elevator, push to end
    UserModel.recentlyViewed.push({
      elevator: elevatorId,
      visitedAt: visitedAt,
    });
  }
  // Keep only the last 10
  const maxLength = 10;
  if (UserModel.recentlyViewed.length > maxLength) {
    const excess = UserModel.recentlyViewed.length - maxLength;
    UserModel.recentlyViewed.splice(0, excess);
  }

  // Register visit
  await UserModel.save();

  res.json(elevator);
});
