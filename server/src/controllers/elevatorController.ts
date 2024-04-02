import { User } from "../db/user";
import { Elevator, stateEnum, ElevatorInterface } from "../db/elevator";
import type { StateEnum } from "../db/elevator";
import asyncHandler from "express-async-handler";
import { getOrSetCache } from "../utils/cacheUtils";
import { extractUserFromReq, getUserElevators } from "../utils/controllerUtils";

// GET all elevators
export const getElevators = asyncHandler(async (req, res) => {
  const elevators = await getUserElevators(req);
  res.json(elevators);
});

// GET elevators count by state
export const getElevatorsCountByState = asyncHandler(async (req, res) => {
  const count = (await getOrSetCache(
    `elevatorsCountByState:${req.auth.sub}`,
    async () => {
      const elevators = await getUserElevators(req);
      const countByState: Record<StateEnum, number> = {
        operational: 0,
        "out-of-order": 0,
        warning: 0,
      };
      elevators.forEach((elevator) => {
        const operationalState = elevator.operationalState.state;
        countByState[operationalState]++;
      });
      return countByState;
    }
  )) as Record<string, number>;
  res.json(count);
});

// GET recently visited elevators
export const getRecentlyVisitedElevators = asyncHandler(async (req, res) => {
  const recent = await getOrSetCache(`recently:${req.auth.sub}`, async () => {
    const user = extractUserFromReq(req);
    const recentElevators = user.recentlyViewed.map((entry) => ({
      elevator: entry.elevator.toString(),
      visitedAt: entry.visitedAt,
    }));

    // Populate elevators
    const populatedElevators = await Promise.all(
      recentElevators.map(async (entry) => {
        const elevator = await Elevator.findById(entry.elevator)
          .select("-__v -chart")
          .exec();
        return {
          elevator,
          visitedAt: entry.visitedAt,
        };
      })
    );
    return populatedElevators;
  });

  res.json(recent);
});

// GET elevators by state
export const getElevatorsByState = asyncHandler(async (req, res) => {
  const state = req.params.state as StateEnum;
  console.log(`state: ${state}`)
  const stateElevators = await getOrSetCache(
    `elevatorsByState:${state}:${req.auth.sub}`,
    async () => {
      if (!Object.values(stateEnum).includes(state)) {
        res.status(404);
        res.json({ message: "Not a valid state" });
      }
      const elevators = await getUserElevators(req);
      const filteredElevators = elevators.filter(
        (elevator) => elevator.operationalState.state === state
      );
      return filteredElevators;
    }
  );
  res.json(stateElevators);
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
  const elevator = await Elevator.findById(elevatorId)
    .populate({ path: "chart", select: "-__v" })
    .select("-__v");
  if (!elevator) {
    res.status(404);
    res.json({ message: "Elevator not found" });
    return;
  }

  // Register visit
  const visitedAt = new Date();
  const UserModel = await User.findOne({ "userInfo.auth0Id": req.auth.sub });
  const existingIndex = UserModel.recentlyViewed.findIndex(
    (entry) => entry.elevator.toString() === elevatorId
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
